<?php

namespace App\Models;

use Database\Factories\RoutineFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Routine extends Model
{
    /** @use HasFactory<RoutineFactory> */
    use HasFactory;

    protected $guarded = [];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsToMany<Habit, $this> */
    public function habits(): BelongsToMany
    {
        return $this->belongsToMany(Habit::class, 'routine_habit')->withPivot('order')->orderByPivot('order', 'asc');
    }
}
