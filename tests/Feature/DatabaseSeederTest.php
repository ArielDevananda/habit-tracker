<?php

use App\Models\Habit;
use App\Models\HabitCompletion;
use App\Models\User;

test('database seeder creates demo habit data', function () {
    $this->seed();

    expect(User::query()
        ->where('email', 'test@example.com')
        ->count())->toBe(1)
        ->and(Habit::query()->count())->toBe(5)
        ->and(HabitCompletion::query()->count())->toBe(27);
});

test('database seeder can run repeatedly without creating duplicates', function () {
    $this->seed();
    $this->seed();

    expect(User::query()
        ->where('email', 'test@example.com')
        ->count())->toBe(1)
        ->and(Habit::query()->count())->toBe(5)
        ->and(HabitCompletion::query()->count())->toBe(27);
});
