<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['required', Rule::in(['admin', 'mentor', 'peserta'])],
            'bidang' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'mentor_id' => ['nullable', 'exists:users,id'],
            'batch_id' => ['nullable', 'exists:batches,id'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'mentor_id' => $validated['role'] === 'peserta' ? ($validated['mentor_id'] ?? null) : null,
            'batch_id' => $validated['role'] === 'peserta' ? ($validated['batch_id'] ?? null) : null,
            'bidang' => $validated['role'] === 'peserta' ? ($validated['bidang'] ?? 'UI/UX Designer') : 'UI/UX Designer',
        ]);
        $user->assignRole($validated['role']);

        if ($validated['role'] === 'mentor' && !empty($validated['participant_ids'])) {
            User::whereIn('id', $validated['participant_ids'])->update(['mentor_id' => $user->id]);
        }

        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
        }

        activity('user_management')
            ->causedBy($request->user())
            ->performedOn($user)
            ->event('user_created')
            ->withProperty('role', $validated['role'])
            ->log('Admin membuat akun pengguna');

        return back()->with('success', 'Akun berhasil dibuat.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => ['nullable', Password::defaults()],
            'role' => ['required', Rule::in(['admin', 'mentor', 'peserta'])],
            'bidang' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'mentor_id' => ['nullable', 'exists:users,id'],
            'batch_id' => ['nullable', 'exists:batches,id'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        if ($request->user()->is($user) && $validated['role'] !== 'admin') {
            return back()->withErrors([
                'role' => 'Admin tidak dapat mencabut role admin dari akunnya sendiri.',
            ]);
        }

        $user->fill(['name' => $validated['name'], 'email' => $validated['email']]);
        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if ($validated['role'] === 'peserta') {
            $user->mentor_id = $validated['mentor_id'] ?? null;
            $user->batch_id = $validated['batch_id'] ?? null;
            if (!empty($validated['bidang'])) {
                $user->bidang = $validated['bidang'];
            }
        } else {
            $user->mentor_id = null;
            $user->batch_id = null;
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        if ($validated['role'] === 'mentor' && $request->has('participant_ids')) {
            $participantIds = $validated['participant_ids'] ?? [];
            User::where('mentor_id', $user->id)
                ->whereNotIn('id', $participantIds)
                ->update(['mentor_id' => null]);

            if (!empty($participantIds)) {
                User::whereIn('id', $participantIds)->update(['mentor_id' => $user->id]);
            }
        } elseif ($validated['role'] !== 'mentor') {
            User::where('mentor_id', $user->id)->update(['mentor_id' => null]);
        }

        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
        }

        activity('user_management')
            ->causedBy($request->user())
            ->performedOn($user)
            ->event('user_updated')
            ->withProperty('role', $validated['role'])
            ->log('Admin memperbarui akun pengguna');

        return back()->with('success', 'Akun berhasil diperbarui.');
    }

    public function assignParticipants(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mentor_id' => ['required', 'exists:users,id'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        $mentor = User::findOrFail($validated['mentor_id']);
        $participantIds = $validated['participant_ids'] ?? [];

        // Hapus mentor_id untuk peserta yang sebelumnya dibimbing mentor ini namun tidak ada di list baru
        User::where('mentor_id', $mentor->id)
            ->whereNotIn('id', $participantIds)
            ->update(['mentor_id' => null]);

        // Tetapkan mentor_id untuk peserta yang dipilih
        if (!empty($participantIds)) {
            User::whereIn('id', $participantIds)->update(['mentor_id' => $mentor->id]);
        }

        activity('user_management')
            ->causedBy($request->user())
            ->performedOn($mentor)
            ->event('participants_assigned')
            ->withProperties(['mentor_id' => $mentor->id, 'participant_ids' => $participantIds])
            ->log("Admin memperbarui peserta bimbingan untuk mentor {$mentor->name}");

        return back()->with('success', "Peserta bimbingan untuk mentor {$mentor->name} berhasil diperbarui.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'Anda tidak dapat menghapus akun sendiri.');

        activity('user_management')
            ->causedBy($request->user())
            ->performedOn($user)
            ->event('user_deleted')
            ->withProperties(['name' => $user->name, 'email' => $user->email])
            ->log('Admin menghapus akun pengguna');

        $user->delete();

        return back()->with('success', 'Akun berhasil dihapus.');
    }
}
