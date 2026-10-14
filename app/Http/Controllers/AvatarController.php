<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AvatarController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $request->user()
            ->addMediaFromRequest('avatar')
            ->usingName('Avatar '.$request->user()->name)
            ->toMediaCollection('avatar');

        activity('profile')
            ->causedBy($request->user())
            ->performedOn($request->user())
            ->event('avatar_updated')
            ->log('Avatar pengguna diperbarui');

        return back()->with('success', 'Avatar berhasil diperbarui.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->clearMediaCollection('avatar');

        activity('profile')
            ->causedBy($request->user())
            ->performedOn($request->user())
            ->event('avatar_deleted')
            ->log('Avatar pengguna dihapus');

        return back()->with('success', 'Avatar berhasil dihapus.');
    }
}
