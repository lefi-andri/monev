<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Attendance extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'mentor_id',
        'date',
        'time',
        'status',
        'type',
        'activity',
        'learning',
        'obstacles',
        'mentor_note',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('attendance')
            ->logOnly(['status', 'type', 'date', 'mentor_note'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
