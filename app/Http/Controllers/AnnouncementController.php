<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AnnouncementController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'in:Info,Penting,Jadwal,Evaluasi'],
            'is_pinned' => ['nullable', 'boolean'],
        ];

        if ($user->hasRole('admin')) {
            $rules['target_role'] = ['required', 'string', 'in:all,mentor,peserta'];
        }

        $validated = $request->validate($rules);

        $targetRole = $user->hasRole('admin')
            ? ($validated['target_role'] ?? 'all')
            : 'peserta'; // Mentor posts to participants

        $announcement = Announcement::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'target_role' => $targetRole,
            'badge' => $validated['badge'] ?? 'Info',
            'is_pinned' => $validated['is_pinned'] ?? false,
        ]);

        // Send notifications to target recipients
        $recipients = collect();

        if ($targetRole === 'all') {
            $recipients = User::where('id', '!=', $user->id)->get();
        } elseif ($targetRole === 'mentor') {
            $recipients = User::role('mentor')->where('id', '!=', $user->id)->get();
        } elseif ($targetRole === 'peserta') {
            if ($user->hasRole('mentor')) {
                $recipients = $user->participants()->get();
                if ($recipients->isEmpty()) {
                    $recipients = User::role('peserta')->get();
                }
            } else {
                $recipients = User::role('peserta')->get();
            }
        }

        foreach ($recipients as $recipient) {
            AppNotification::create([
                'user_id' => $recipient->id,
                'title' => 'Pengumuman Baru: ' . $announcement->title,
                'message' => Str::limit($announcement->content, 120),
                'type' => 'announcement',
                'data' => [
                    'announcement_id' => $announcement->id,
                    'author_name' => $user->name,
                    'author_role' => $user->getRoleNames()->first(),
                    'badge' => $announcement->badge,
                ],
            ]);
        }

        activity('announcement')
            ->causedBy($user)
            ->performedOn($announcement)
            ->event('created')
            ->log("{$user->name} membuat pengumuman: {$announcement->title}");

        return back()->with('success', 'Pengumuman berhasil dipublikasikan dan notifikasi telah dikirimkan.');
    }

    public function destroy(Request $request, Announcement $announcement): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $user->hasRole('admin') || $user->id === $announcement->user_id,
            403,
            'Anda tidak memiliki izin untuk menghapus pengumuman ini.'
        );

        activity('announcement')
            ->causedBy($user)
            ->performedOn($announcement)
            ->event('deleted')
            ->log("{$user->name} menghapus pengumuman: {$announcement->title}");

        $announcement->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
