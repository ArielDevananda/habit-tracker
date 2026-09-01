<?php

namespace App\Models;

use Database\Factories\HabitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $description
 * @property string|null $category
 * @property string|null $target_value
 * @property string|null $unit
 * @property string $type
 * @property string $frequency
 * @property array<int, int>|null $days_of_week
 * @property string $status
 * @property Carbon $start_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $user
 * @property-read Collection<int, HabitCompletion> $completions
 */
#[Fillable([
    'name',
    'description',
    'category',
    'target_value',
    'unit',
    'type',
    'frequency',
    'days_of_week',
    'status',
    'start_date',
])]
class Habit extends Model
{
    /** @use HasFactory<HabitFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The model's default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'type' => 'binary',
        'frequency' => 'daily',
        'status' => 'active',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(HabitCompletion::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_value' => 'decimal:2',
            'days_of_week' => 'array',
            'start_date' => 'date:Y-m-d',
        ];
    }
}
