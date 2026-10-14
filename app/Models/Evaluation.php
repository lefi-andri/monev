<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mentor_id',
        'period_id',
        'ratings',
        'mentor_comment',
        'status',
        'evaluated_at',
    ];

    protected $casts = [
        'ratings' => 'array',
        'period_id' => 'integer',
        'evaluated_at' => 'datetime',
    ];

    /**
     * Get the participant associated with this evaluation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the mentor who evaluated.
     */
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
