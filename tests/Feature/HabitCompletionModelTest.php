<?php

use App\Models\Habit;
use App\Models\HabitCompletion;
use Illuminate\Database\QueryException;

test('a habit can have completions', function () {
    $habit = Habit::factory()->create();

    $completion = HabitCompletion::factory()
        ->for($habit)
        ->create([
            'completed_on' => '2026-08-18',
            'value' => 20,
        ]);

    expect($completion->habit->is($habit))->toBeTrue()
        ->and($habit->completions->contains($completion))->toBeTrue();
});

test('completion attributes use the expected casts', function () {
    $completion = HabitCompletion::factory()->create([
        'completed_on' => '2026-08-18',
        'value' => 20,
    ]);

    expect($completion->completed_on->toDateString())->toBe('2026-08-18')
        ->and($completion->value)->toBe('20.00');
});

test('a habit can only have one completion per date', function () {
    $habit = Habit::factory()->create();

    HabitCompletion::factory()
        ->for($habit)
        ->create([
            'completed_on' => '2026-08-18',
        ]);

    expect(fn () => HabitCompletion::factory()
        ->for($habit)
        ->create([
            'completed_on' => '2026-08-18',
        ]))->toThrow(QueryException::class);
});
