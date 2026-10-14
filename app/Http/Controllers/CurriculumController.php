<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\CurriculumFocus;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    /**
     * Store or update mentor's learning focus and module progress for a period.
     */
    public function saveFocus(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasAnyRole(['mentor', 'admin'])) {
            abort(403, 'Hanya mentor atau admin yang dapat mengatur fokus pembelajaran.');
        }

        $validated = $request->validate([
            'participant_id' => ['required', 'exists:users,id'],
            'period_id' => ['required', 'integer', 'min:1', 'max:12'],
            'bidang' => ['nullable', 'string', 'max:100'],
            'focus_text' => ['nullable', 'string', 'max:2500'],
            'modules' => ['nullable', 'array'],
            'completed_modules' => ['nullable', 'array'],
        ]);

        $participant = User::findOrFail($validated['participant_id']);

        if (! empty($validated['bidang'])) {
            $participant->bidang = $validated['bidang'];
            $participant->save();
        }

        $bidang = $validated['bidang'] ?? $participant->bidang ?? 'UI/UX Designer';

        $focus = CurriculumFocus::updateOrCreate(
            [
                'user_id' => $participant->id,
                'period_id' => $validated['period_id'],
            ],
            [
                'mentor_id' => $user->id,
                'bidang' => $bidang,
                'focus_text' => $validated['focus_text'] ?? null,
                'modules' => $validated['modules'] ?? null,
                'completed_modules' => $validated['completed_modules'] ?? [],
            ]
        );

        // Audit Trail
        activity()
            ->performedOn($focus)
            ->causedBy($user)
            ->log("Mentor {$user->name} memperbarui kurikulum ({$bidang}) & fokus pembelajaran Periode {$validated['period_id']} untuk {$participant->name}");

        // Notifikasi ke peserta
        AppNotification::create([
            'user_id' => $participant->id,
            'type' => 'system',
            'title' => "Kurikulum {$bidang} Periode {$validated['period_id']} Diperbarui",
            'message' => "Mentor {$user->name} telah memperbarui materi kurikulum & arahan pembelajaran bidang {$bidang} untuk Periode {$validated['period_id']}.",
            'data' => [
                'period_id' => $validated['period_id'],
                'bidang' => $bidang,
                'focus_id' => $focus->id,
            ],
        ]);

        return back()->with('success', "Kurikulum bidang {$bidang} & fokus pembelajaran Periode {$validated['period_id']} berhasil disimpan.");
    }
}
