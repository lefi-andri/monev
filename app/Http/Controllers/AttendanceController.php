<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    /**
     * Peserta submits or updates daily attendance.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required'],
            'type' => ['required', 'in:Hadir,Izin,Sakit'],
            'activity' => ['required', 'string', 'min:3'],
            'learning' => ['required', 'string', 'min:3'],
            'obstacles' => ['nullable', 'string'],
        ], [
            'date.required' => 'Tanggal presensi wajib diisi.',
            'activity.required' => 'Uraian aktivitas wajib diisi.',
            'activity.min' => 'Uraian aktivitas minimal 3 karakter.',
            'learning.required' => 'Pembelajaran yang diperoleh wajib diisi.',
            'learning.min' => 'Pembelajaran minimal 3 karakter.',
        ]);

        $user = $request->user();
        $dateFormatted = Carbon::parse($validated['date'])->format('Y-m-d');
        $currentTime = Carbon::now('Asia/Jakarta')->format('H.i') . ' WIB';

        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => $dateFormatted,
            ],
            [
                'time' => $currentTime,
                'status' => 'pending',
                'type' => $validated['type'],
                'activity' => $validated['activity'],
                'learning' => $validated['learning'],
                'obstacles' => $validated['obstacles'] ?: 'Tidak ada kendala yang dialami.',
                'mentor_id' => null,
                'mentor_note' => null,
                'verified_at' => null,
            ]
        );

        activity()
            ->causedBy($user)
            ->performedOn($attendance)
            ->event('submitted')
            ->log("Peserta {$user->name} mengirimkan presensi harian untuk tanggal {$validated['date']}.");

        $targetMentor = $user->mentor ?? \App\Models\User::role('mentor')->first();
        if ($targetMentor) {
            \App\Models\AppNotification::create([
                'user_id' => $targetMentor->id,
                'title' => 'Presensi Baru Perlu Verifikasi',
                'message' => "Peserta {$user->name} telah mengirim presensi untuk tanggal {$dateFormatted}.",
                'type' => 'attendance',
                'data' => [
                    'attendance_id' => $attendance->id,
                    'participant_id' => $user->id,
                    'participant_name' => $user->name,
                    'date' => $dateFormatted,
                ],
            ]);
        }

        return back()->with('success', 'Presensi berhasil dikirim dan menunggu verifikasi mentor.');
    }

    /**
     * Mentor reviews and verifies attendance.
     * Actions:
     * - 'approve': Setujui Kehadiran (status: approved)
     * - 'approve_revision': Setujui Kehadiran, tapi Minta Perbaikan Uraian (status: needs_revision)
     * - 'reject': Tolak Kehadiran (status: rejected)
     */
    public function verify(Request $request, Attendance $attendance): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:approve,approve_revision,reject'],
            'mentor_note' => ['nullable', 'string'],
        ]);

        $mentor = $request->user();
        $action = $validated['action'];
        $mentorNote = $validated['mentor_note'] ?? null;

        $status = match ($action) {
            'approve' => 'approved',
            'approve_revision' => 'needs_revision',
            'reject' => 'rejected',
        };

        $attendance->update([
            'status' => $status,
            'mentor_id' => $mentor->id,
            'mentor_note' => $mentorNote,
            'verified_at' => Carbon::now('Asia/Jakarta'),
        ]);

        $studentName = $attendance->user?->name ?? 'Peserta';
        $dateFormatted = Carbon::parse($attendance->date)->format('d F Y');

        $message = match ($action) {
            'approve' => "Kehadiran {$studentName} pada {$dateFormatted} berhasil disetujui.",
            'approve_revision' => "Kehadiran {$studentName} pada {$dateFormatted} disetujui bersyarat (permintaan perbaikan uraian terkirim).",
            'reject' => "Kehadiran {$studentName} pada {$dateFormatted} telah ditolak.",
        };

        activity()
            ->causedBy($mentor)
            ->performedOn($attendance)
            ->event('verified')
            ->log("Mentor {$mentor->name} memverifikasi presensi {$studentName} ({$status}).");

        \App\Models\AppNotification::create([
            'user_id' => $attendance->user_id,
            'title' => "Presensi ({$dateFormatted}): " . match ($action) {
                'approve' => 'Disetujui',
                'approve_revision' => 'Perlu Revisi Uraian',
                'reject' => 'Ditolak',
            },
            'message' => match ($action) {
                'approve' => "Presensi Anda pada tanggal {$dateFormatted} telah disetujui oleh Mentor {$mentor->name}.",
                'approve_revision' => "Mentor {$mentor->name} meminta perbaikan uraian presensi ({$dateFormatted})" . ($mentorNote ? ": \"{$mentorNote}\"" : "."),
                'reject' => "Presensi Anda pada tanggal {$dateFormatted} ditolak oleh Mentor {$mentor->name}" . ($mentorNote ? ": \"{$mentorNote}\"" : "."),
            },
            'type' => 'attendance',
            'data' => [
                'attendance_id' => $attendance->id,
                'status' => $status,
                'mentor_note' => $mentorNote,
            ],
        ]);

        return back()->with('success', $message);
    }
}
