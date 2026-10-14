<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    /**
     * Store or update a monthly evaluation.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasAnyRole(['mentor', 'admin'])) {
            abort(403, 'Hanya mentor atau admin yang dapat mengisi evaluasi.');
        }

        $validated = $request->validate([
            'participant_id' => ['required', 'exists:users,id'],
            'period_id' => ['required', 'integer', 'min:1', 'max:12'],
            'ratings' => ['required', 'array'],
            'mentor_comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $participant = User::findOrFail($validated['participant_id']);

        $evaluation = Evaluation::updateOrCreate(
            [
                'user_id' => $participant->id,
                'period_id' => $validated['period_id'],
            ],
            [
                'mentor_id' => $user->id,
                'ratings' => $validated['ratings'],
                'mentor_comment' => $validated['mentor_comment'] ?? null,
                'status' => 'completed',
                'evaluated_at' => now(),
            ]
        );

        // Catat di Audit Trail
        activity()
            ->performedOn($evaluation)
            ->causedBy($user)
            ->log("Mentor {$user->name} menyimpan evaluasi bulanan Periode {$validated['period_id']} untuk {$participant->name}");

        // Kirim notifikasi ke peserta
        AppNotification::create([
            'user_id' => $participant->id,
            'type' => 'evaluation',
            'title' => "Evaluasi Bulanan Periode {$validated['period_id']} Dinilai",
            'message' => "Mentor {$user->name} telah mengisi evaluasi bulanan Periode {$validated['period_id']} Anda.",
            'data' => [
                'period_id' => $validated['period_id'],
                'evaluation_id' => $evaluation->id,
            ],
        ]);

        return back()->with('success', "Evaluasi bulanan Periode {$validated['period_id']} untuk {$participant->name} berhasil disimpan.");
    }
}
