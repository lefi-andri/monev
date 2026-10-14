<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CurriculumFocus extends Model
{
    use HasFactory;

    protected $table = 'curriculum_focuses';

    protected $fillable = [
        'user_id',
        'mentor_id',
        'period_id',
        'bidang',
        'focus_text',
        'modules',
        'completed_modules',
    ];

    protected $casts = [
        'modules' => 'array',
        'completed_modules' => 'array',
        'period_id' => 'integer',
    ];

    /**
     * The participant who receives this focus.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The mentor who created this focus.
     */
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
