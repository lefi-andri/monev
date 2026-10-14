<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $allUsers = User::query()
                ->with(['roles', 'media', 'mentor', 'participants', 'batch'])
                ->latest()
                ->get();

            $batches = Batch::withCount(['users' => fn ($q) => $q->role('peserta')])
                ->latest()
                ->get()
                ->map(fn ($b) => [
                    'id' => $b->id,
                    'name' => $b->name,
                    'description' => $b->description,
                    'start_date' => $b->start_date?->format('Y-m-d'),
                    'end_date' => $b->end_date?->format('Y-m-d'),
                    'start_date_formatted' => $b->start_date?->format('d M Y'),
                    'end_date_formatted' => $b->end_date?->format('d M Y'),
                    'is_active' => (bool) $b->is_active,
                    'status' => $b->status,
                    'participants_count' => $b->users_count,
                    'participant_ids' => $b->users()->role('peserta')->pluck('id')->values()->all(),
                ]);

            $activeBatch = $batches->firstWhere('is_active', true);

            $mentorsList = $allUsers
                ->filter(fn ($u) => $u->hasRole('mentor'))
                ->values()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'avatar_url' => $m->avatar_url,
                    'participants_count' => $m->participants->count(),
                    'participant_ids' => $m->participants->pluck('id')->values()->all(),
                    'participants' => $m->participants->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'email' => $p->email,
                    ])->values()->all(),
                ]);

            $participantsList = $allUsers
                ->filter(fn ($u) => $u->hasRole('peserta'))
                ->values()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'email' => $p->email,
                    'avatar_url' => $p->avatar_url,
                    'mentor_id' => $p->mentor_id,
                    'mentor_name' => $p->mentor?->name,
                    'batch_id' => $p->batch_id,
                    'batch_name' => $p->batch?->name,
                    'bidang' => $p->bidang ?? 'UI/UX Designer',
                ]);

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'users' => $allUsers->count(),
                    'admins' => $allUsers->filter(fn ($u) => $u->hasRole('admin'))->count(),
                    'mentors' => $mentorsList->count(),
                    'participants' => $participantsList->count(),
                    'batches' => $batches->count(),
                    'activeBatchName' => $activeBatch['name'] ?? 'Belum ada',
                ],
                'batches' => $batches,
                'activeBatch' => $activeBatch,
                'mentorsList' => $mentorsList,
                'participantsList' => $participantsList,
                'users' => $allUsers->map(fn (User $account) => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'email' => $account->email,
                    'role' => $account->getRoleNames()->first(),
                    'bidang' => $account->bidang ?? 'UI/UX Designer',
                    'avatar_url' => $account->avatar_url,
                    'mentor_id' => $account->mentor_id,
                    'mentor_name' => $account->mentor?->name,
                    'batch_id' => $account->batch_id,
                    'batch_name' => $account->batch?->name,
                    'participants_count' => $account->participants->count(),
                    'participants' => $account->participants->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'email' => $p->email,
                        'bidang' => $p->bidang ?? 'UI/UX Designer',
                    ])->values()->all(),
                    'created_at' => $account->created_at?->format('d M Y'),
                ]),
                'activities' => Activity::query()
                    ->with('causer')
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(fn (Activity $activity) => [
                        'id' => $activity->id,
                        'event' => $activity->event,
                        'description' => $activity->description,
                        'causer' => $activity->causer?->name ?? 'Sistem',
                        'created_at' => $activity->created_at?->format('d M Y H:i'),
                    ]),
                'announcements' => Announcement::with(['user.media', 'user.roles'])
                    ->latest()
                    ->get()
                    ->map(fn ($a) => [
                        'id' => $a->id,
                        'title' => $a->title,
                        'content' => $a->content,
                        'target_role' => $a->target_role,
                        'badge' => $a->badge,
                        'is_pinned' => $a->is_pinned,
                        'author_id' => $a->user_id,
                        'author_name' => $a->user?->name ?? 'Admin',
                        'author_role' => $a->user?->getRoleNames()->first() ?? 'admin',
                        'author_avatar' => $a->user?->avatar_url,
                        'created_at' => $a->created_at?->format('d M Y H:i'),
                        'relative_time' => $a->created_at?->diffForHumans(),
                    ]),
            ]);
        }

        if ($user->hasRole('peserta')) {
            $attendances = \App\Models\Attendance::where('user_id', $user->id)
                ->orderBy('date')
                ->get();

            $todayDate = now('Asia/Jakarta')->format('Y-m-d');

            $mappedAttendances = $attendances->map(fn ($a) => [
                'id' => $a->id,
                'user_id' => $a->user_id,
                'mentor_id' => $a->mentor_id,
                'date' => \Illuminate\Support\Carbon::parse($a->date)->format('Y-m-d'),
                'time' => $a->time,
                'status' => $a->status,
                'type' => $a->type,
                'activity' => $a->activity,
                'learning' => $a->learning,
                'obstacles' => $a->obstacles,
                'mentor_note' => $a->mentor_note,
                'verified_at' => $a->verified_at?->format('Y-m-d H:i:s'),
            ]);

            $todayAttendance = $mappedAttendances->firstWhere('date', $todayDate)
                ?? $mappedAttendances->firstWhere('date', '2026-10-13');

            $announcements = Announcement::with(['user.media', 'user.roles'])
                ->whereIn('target_role', ['all', 'peserta'])
                ->latest()
                ->get()
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'content' => $a->content,
                    'target_role' => $a->target_role,
                    'badge' => $a->badge,
                    'is_pinned' => $a->is_pinned,
                    'author_id' => $a->user_id,
                    'author_name' => $a->user?->name ?? 'Pengelola',
                    'author_role' => $a->user?->getRoleNames()->first() ?? 'admin',
                    'author_avatar' => $a->user?->avatar_url,
                    'created_at' => $a->created_at?->format('d M Y H:i'),
                    'relative_time' => $a->created_at?->diffForHumans(),
                ]);

            $evaluations = \App\Models\Evaluation::where('user_id', $user->id)
                ->with('mentor.media')
                ->get()
                ->map(fn ($e) => [
                    'id' => $e->id,
                    'period_id' => $e->period_id,
                    'ratings' => $e->ratings,
                    'mentor_comment' => $e->mentor_comment,
                    'status' => $e->status,
                    'mentor_name' => $e->mentor?->name ?? 'Mentor',
                    'mentor_avatar' => $e->mentor?->avatar_url,
                    'evaluated_at' => $e->evaluated_at?->format('d M Y H:i'),
                ]);

            $curriculumFocuses = \App\Models\CurriculumFocus::where('user_id', $user->id)
                ->with('mentor.media')
                ->get()
                ->map(fn ($f) => [
                    'id' => $f->id,
                    'period_id' => $f->period_id,
                    'bidang' => $f->bidang ?? ($user->bidang ?? 'UI/UX Designer'),
                    'focus_text' => $f->focus_text,
                    'modules' => $f->modules ?? null,
                    'completed_modules' => $f->completed_modules ?? [],
                    'mentor_name' => $f->mentor?->name ?? 'Mentor',
                    'mentor_avatar' => $f->mentor?->avatar_url,
                    'updated_at' => $f->updated_at?->format('d M Y H:i'),
                ]);

            $user->load('batch');

            return Inertia::render('Participant/Dashboard', [
                'attendances' => $mappedAttendances,
                'todayAttendance' => $todayAttendance,
                'currentDate' => $todayDate,
                'announcements' => $announcements,
                'evaluations' => $evaluations,
                'curriculumFocuses' => $curriculumFocuses,
                'batch' => $user->batch ? [
                    'id' => $user->batch->id,
                    'name' => $user->batch->name,
                    'description' => $user->batch->description,
                    'start_date' => $user->batch->start_date?->format('d M Y'),
                    'end_date' => $user->batch->end_date?->format('d M Y'),
                    'is_active' => (bool) $user->batch->is_active,
                    'status' => $user->batch->status,
                ] : null,
                'flash' => [
                    'success' => session('success'),
                ],
            ]);
        }

        // Mentor Dashboard
        $mentorParticipants = $user->participants()->with(['media', 'batch'])->get();
        if ($mentorParticipants->isEmpty()) {
            $mentorParticipants = User::role('peserta')->with(['media', 'batch'])->get();
        }

        $selectedParticipantId = $request->query('participant_id');
        $participant = ($selectedParticipantId ? $mentorParticipants->firstWhere('id', $selectedParticipantId) : null)
            ?? $mentorParticipants->first();

        $batches = Batch::latest()->get()->map(fn ($b) => [
            'id' => $b->id,
            'name' => $b->name,
            'is_active' => (bool) $b->is_active,
            'status' => $b->status,
        ]);

        $attendances = $participant
            ? \App\Models\Attendance::where('user_id', $participant->id)->orderBy('date')->get()
            : collect();

        $mappedAttendances = $attendances->map(fn ($a) => [
            'id' => $a->id,
            'user_id' => $a->user_id,
            'mentor_id' => $a->mentor_id,
            'date' => \Illuminate\Support\Carbon::parse($a->date)->format('Y-m-d'),
            'time' => $a->time,
            'status' => $a->status,
            'type' => $a->type,
            'activity' => $a->activity,
            'learning' => $a->learning,
            'obstacles' => $a->obstacles,
            'mentor_note' => $a->mentor_note,
            'verified_at' => $a->verified_at?->format('Y-m-d H:i:s'),
        ]);

        $pendingAttendancesCount = $mappedAttendances->where('status', 'pending')->count();

        $mentorAnnouncements = Announcement::with(['user.media', 'user.roles'])
            ->where(function ($q) use ($user) {
                $q->whereIn('target_role', ['all', 'mentor'])
                  ->orWhere('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'content' => $a->content,
                'target_role' => $a->target_role,
                'badge' => $a->badge,
                'is_pinned' => $a->is_pinned,
                'author_id' => $a->user_id,
                'author_name' => $a->user?->name ?? 'Mentor',
                'author_role' => $a->user?->getRoleNames()->first() ?? 'mentor',
                'author_avatar' => $a->user?->avatar_url,
                'can_delete' => $a->user_id === $user->id || $user->hasRole('admin'),
                'created_at' => $a->created_at?->format('d M Y H:i'),
                'relative_time' => $a->created_at?->diffForHumans(),
            ]);

        $mentorEvaluations = $participant
            ? \App\Models\Evaluation::where('user_id', $participant->id)
                ->with('mentor.media')
                ->get()
                ->map(fn ($e) => [
                    'id' => $e->id,
                    'period_id' => $e->period_id,
                    'ratings' => $e->ratings,
                    'mentor_comment' => $e->mentor_comment,
                    'status' => $e->status,
                    'mentor_name' => $e->mentor?->name ?? 'Mentor',
                    'mentor_avatar' => $e->mentor?->avatar_url,
                    'evaluated_at' => $e->evaluated_at?->format('d M Y H:i'),
                ])
            : collect();

        $mentorCurriculumFocuses = $participant
            ? \App\Models\CurriculumFocus::where('user_id', $participant->id)
                ->with('mentor.media')
                ->get()
                ->map(fn ($f) => [
                    'id' => $f->id,
                    'period_id' => $f->period_id,
                    'bidang' => $f->bidang ?? ($participant->bidang ?? 'UI/UX Designer'),
                    'focus_text' => $f->focus_text,
                    'modules' => $f->modules ?? null,
                    'completed_modules' => $f->completed_modules ?? [],
                    'mentor_name' => $f->mentor?->name ?? 'Mentor',
                    'mentor_avatar' => $f->mentor?->avatar_url,
                    'updated_at' => $f->updated_at?->format('d M Y H:i'),
                ])
            : collect();

        return Inertia::render('Dashboard', [
            'batches' => $batches,
            'participants' => $mentorParticipants->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'email' => $p->email,
                'avatar_url' => $p->avatar_url,
                'phone' => '082155006246',
                'role' => $p->bidang ?? 'UI/UX Designer',
                'bidang' => $p->bidang ?? 'UI/UX Designer',
                'company' => 'Kokek',
                'location' => 'KOTA SURABAYA',
                'batch_id' => $p->batch_id,
                'batch' => $p->batch?->name ?? 'Belum ditentukan',
                'period' => $p->batch ? ($p->batch->start_date?->format('d M Y') . ' - ' . $p->batch->end_date?->format('d M Y')) : '21 Sep 2026 - 20 Mar 2027',
            ]),
            'participant' => $participant ? [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
                'avatar_url' => $participant->avatar_url,
                'phone' => '082155006246',
                'role' => $participant->bidang ?? 'UI/UX Designer',
                'bidang' => $participant->bidang ?? 'UI/UX Designer',
                'company' => 'Kokek',
                'location' => 'KOTA SURABAYA',
                'batch_id' => $participant->batch_id,
                'batch' => $participant->batch?->name ?? 'Belum ditentukan',
                'period' => $participant->batch ? ($participant->batch->start_date?->format('d M Y') . ' - ' . $participant->batch->end_date?->format('d M Y')) : '21 Sep 2026 - 20 Mar 2027',
            ] : null,
            'attendances' => $mappedAttendances,
            'pendingAttendancesCount' => $pendingAttendancesCount,
            'announcements' => $mentorAnnouncements,
            'evaluations' => $mentorEvaluations,
            'curriculumFocuses' => $mentorCurriculumFocuses,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }
}
