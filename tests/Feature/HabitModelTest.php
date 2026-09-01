<?php

use App\Models\Habit;
use App\Models\User;

test('a user can own habits', function () {
    $user = User::factory()->create();

    $habit = Habit::factory()
        ->for($user)
        ->create();

    expect($habit->user->is($user))->toBeTrue()
        ->and($user->habits->contains($habit))->toBeTrue();
});

test('habit attributes use the expected defaults and casts', function () {
    $user = User::factory()->create();

    $habit = $user->habits()->create([
        'name' => 'Read a Book',
        'target_value' => 20,
        'unit' => 'minutes',
        'days_of_week' => [1, 3, 5],
        'start_date' => '2026-08-18',
    ]);

    expect($habit->frequency)->toBe('daily')
        ->and($habit->status)->toBe('active')
        ->and($habit->target_value)->toBe('20.00')
        ->and($habit->days_of_week)->toBe([1, 3, 5])
        ->and($habit->start_date->toDateString())->toBe('2026-08-18');
});

test('a habit can be soft deleted', function () {
    $habit = Habit::factory()->create();

    $habit->delete();

    expect($habit->trashed())->toBeTrue()
        ->and(Habit::query()->find($habit->id))->toBeNull()
        ->and(Habit::withTrashed()->find($habit->id))->not->toBeNull();
});
