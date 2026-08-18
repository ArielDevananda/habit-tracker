<?php

use App\Models\Habit;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('a user may view the habit list and create habits', function () {
    $user = User::factory()->create();
    $gate = Gate::forUser($user);

    expect($gate->allows('viewAny', Habit::class))->toBeTrue()
        ->and($gate->allows('create', Habit::class))->toBeTrue();
});

test('an owner may manage their habit', function () {
    $owner = User::factory()->create();
    $habit = Habit::factory()->for($owner)->create();
    $gate = Gate::forUser($owner);

    expect($gate->allows('view', $habit))->toBeTrue()
        ->and($gate->allows('update', $habit))->toBeTrue()
        ->and($gate->allows('delete', $habit))->toBeTrue()
        ->and($gate->allows('restore', $habit))->toBeTrue()
        ->and($gate->allows('forceDelete', $habit))->toBeTrue();
});

test('another user may not manage the habit', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $habit = Habit::factory()->for($owner)->create();
    $gate = Gate::forUser($otherUser);

    expect($gate->allows('view', $habit))->toBeFalse()
        ->and($gate->allows('update', $habit))->toBeFalse()
        ->and($gate->allows('delete', $habit))->toBeFalse()
        ->and($gate->allows('restore', $habit))->toBeFalse()
        ->and($gate->allows('forceDelete', $habit))->toBeFalse();
});
