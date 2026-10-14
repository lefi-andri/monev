<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'view audit trail',
            'manage participants',
            'review attendance',
            'manage curriculum',
            'submit assessment',
            'review payments',
            'view own progress',
            'submit attendance',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $adminRole = Role::findOrCreate('admin', 'web');
        $mentorRole = Role::findOrCreate('mentor', 'web');
        $participantRole = Role::findOrCreate('peserta', 'web');

        $adminRole->syncPermissions($permissions);
        $mentorRole->syncPermissions([
            'manage participants', 'review attendance', 'manage curriculum',
            'submit assessment', 'review payments',
        ]);
        $participantRole->syncPermissions(['view own progress', 'submit attendance']);

        $batch1 = \App\Models\Batch::firstOrCreate(
            ['name' => 'Batch 1 - Tahun 2026'],
            [
                'description' => 'Program Magang & Monev Angkatan 1 Tahun 2026 PT KOKEK',
                'start_date' => '2026-09-21',
                'end_date' => '2027-03-20',
                'is_active' => true,
                'status' => 'active',
            ]
        );

        \App\Models\Batch::firstOrCreate(
            ['name' => 'Batch 2 - Tahun 2027'],
            [
                'description' => 'Program Magang & Monev Angkatan 2 Tahun 2027 PT KOKEK',
                'start_date' => '2027-03-21',
                'end_date' => '2027-09-20',
                'is_active' => false,
                'status' => 'upcoming',
            ]
        );

        $password = env('MONEV_SEED_PASSWORD', 'Password123!');
        $accounts = [
            ['name' => 'Admin Monev', 'email' => 'admin@monev.test', 'role' => 'admin'],
            ['name' => 'Lefi Andri Lestari', 'email' => 'mentor@monev.test', 'role' => 'mentor'],
            ['name' => 'M. Riyan Akbari', 'email' => 'peserta@monev.test', 'role' => 'peserta'],
        ];

        $mentorUser = null;
        foreach ($accounts as $account) {
            $user = User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                    'mentor_id' => $account['role'] === 'peserta' && $mentorUser ? $mentorUser->id : null,
                    'batch_id' => $account['role'] === 'peserta' ? $batch1->id : null,
                    'bidang' => 'UI/UX Designer',
                ],
            );

            $user->syncRoles([$account['role']]);

            if ($account['role'] === 'mentor') {
                $mentorUser = $user;
            }
        }

        $this->call(AttendanceSeeder::class);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
