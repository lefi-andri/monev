<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/ActivityLogs', [
            'activities' => Activity::query()
                ->with('causer', 'subject')
                ->latest()
                ->paginate(25)
                ->through(fn (Activity $activity) => [
                    'id' => $activity->id,
                    'log_name' => $activity->log_name,
                    'event' => $activity->event,
                    'description' => $activity->description,
                    'causer' => $activity->causer?->name ?? 'Sistem',
                    'subject' => $activity->subject?->name,
                    'properties' => $activity->properties,
                    'created_at' => $activity->created_at?->format('d M Y H:i:s'),
                ]),
        ]);
    }
}
