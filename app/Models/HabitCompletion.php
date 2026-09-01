<?php

namespace App\Models;

use Database\Factories\HabitCompletionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $habit_id
 * @property Carbon $completed_on
 * @property string|null $value
 * @property string|null $note
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Habit $habit
 */
#[Fillable([
    'completed_on',
    'value',
    'note',
])]
class HabitCompletion extends Model
{
    /** @use HasFactory<HabitCompletionFactory> */
    use HasFactory;

    public function habit(): BelongsTo
    {
        return $this->belongsTo(Habit::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'completed_on' => 'date:Y-m-d',
            'value' => 'decimal:2',
        ];
    }
}
