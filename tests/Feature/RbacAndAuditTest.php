<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    Permission::findOrCreate('manage users');
    Permission::findOrCreate('view audit trail');

    Role::findOrCreate('admin')->givePermissionTo(['manage users', 'view audit trail']);
    Role::findOrCreate('mentor');
    Role::findOrCreate('peserta');
});

test('dashboard is selected from the authenticated role', function (string $role, string $component) {
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['admin', 'Admin/Dashboard'],
    ['mentor', 'Dashboard'],
    ['peserta', 'Participant/Dashboard'],
]);

test('mentor cannot access admin audit trail', function () {
    $mentor = User::factory()->create();
    $mentor->assignRole('mentor');

    $this->actingAs($mentor)
        ->get(route('admin.activity-logs.index'))
        ->assertForbidden();
});

test('admin can create a user with a role and the action is audited', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Mentor Baru',
        'email' => 'mentor.baru@example.com',
        'password' => 'Password123!',
        'role' => 'mentor',
    ])->assertSessionHasNoErrors();

    $created = User::where('email', 'mentor.baru@example.com')->firstOrFail();

    expect($created->hasRole('mentor'))->toBeTrue();
    expect(Activity::where('event', 'user_created')->where('subject_id', $created->id)->exists())->toBeTrue();
});

test('user can upload and replace an avatar with media library', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $firstAvatar = storage_path('framework/cache/avatar-test-first.png');
    $secondAvatar = storage_path('framework/cache/avatar-test-second.png');
    copy(base_path('ui-design/2. menu peserta.png'), $firstAvatar);
    copy(base_path('ui-design/2. menu peserta.png'), $secondAvatar);

    $this->actingAs($user)->post(route('profile.avatar.update'), [
        'avatar' => new UploadedFile($firstAvatar, 'avatar.png', 'image/png', null, true),
    ])->assertSessionHasNoErrors();

    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);

    $this->actingAs($user)->post(route('profile.avatar.update'), [
        'avatar' => new UploadedFile($secondAvatar, 'replacement.png', 'image/png', null, true),
    ])->assertSessionHasNoErrors();

    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);
    expect(Activity::where('event', 'avatar_updated')->where('causer_id', $user->id)->count())->toBe(2);
});

test('login and logout are recorded in the audit trail', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('dashboard', absolute: false));
    $this->post('/logout')->assertRedirect('/');

    expect(Activity::where('causer_id', $user->id)->where('event', 'login')->exists())->toBeTrue();
    expect(Activity::where('causer_id', $user->id)->where('event', 'logout')->exists())->toBeTrue();
});
