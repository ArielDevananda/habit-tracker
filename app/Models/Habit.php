<?php

namespace App\Models;

use Database\Factories\HabitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
    'current_streak',
    'longest_streak',
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

    public function recalculateStreak(): void
    {
        $completions = $this->completions()->orderBy('completed_on')->get();

        $completedDates = [];
        foreach ($completions as $c) {
            $isSuccess = false;
            if (in_array($this->type, ['binary', 'avoid'])) {
                $isSuccess = true;
            } else {
                $isSuccess = $c->value >= ($this->target_value ?? 1);
            }

            if ($isSuccess) {
                $completedDates[] = Carbon::parse($c->completed_on)->format('Y-m-d');
            }
        }

        $startDate = Carbon::parse($this->start_date)->startOfDay();
        $today = Carbon::today();

        $scheduledDates = [];
        $current = $startDate->copy();
        while ($current->lte($today)) {
            $add = false;
            if ($this->frequency === 'daily') {
                $add = true;
            } elseif ($this->frequency === 'weekly' && is_array($this->days_of_week)) {
                if (in_array($current->dayOfWeek, $this->days_of_week)) {
                    $add = true;
                }
            }

            if ($add) {
                $scheduledDates[] = $current->format('Y-m-d');
            }
            $current->addDay();
        }

        $currentStreak = 0;
        $longestStreak = 0;
        $tempStreak = 0;
        $todayStr = $today->format('Y-m-d');

        $scheduledDatesRev = array_reverse($scheduledDates);

        foreach ($scheduledDatesRev as $date) {
            if (in_array($date, $completedDates)) {
                $currentStreak++;
            } else {
                if ($date === $todayStr) {
                    continue;
                }
                break;
            }
        }

        foreach ($scheduledDates as $date) {
            if (in_array($date, $completedDates)) {
                $tempStreak++;
                if ($tempStreak > $longestStreak) {
                    $longestStreak = $tempStreak;
                }
            } else {
                $tempStreak = 0;
            }
        }

        $this->updateQuietly([
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
        ]);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<HabitCompletion, $this> */
    public function completions(): HasMany
    {
        return $this->hasMany(HabitCompletion::class);
    }

    /** @return BelongsToMany<Goal, $this> */
    public function goals(): BelongsToMany
    {
        return $this->belongsToMany(Goal::class);
    }

    /** @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Routine, $this> */
    public function routines(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Routine::class, 'routine_habit')->withPivot('order');
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
