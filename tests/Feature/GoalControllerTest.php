<?php

use App\Models\Goal;
use App\Models\Habit;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can view goals index', function () {
    $user = User::factory()->create();

    $goal = Goal::factory()->for($user)->create([
        'name' => 'Get Fit',
    ]);

    $this->actingAs($user)
        ->get(route('goals.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/index')
            ->has('goals', 1)
            ->where('goals.0.name', 'Get Fit')
        );
});

test('authenticated user can create a goal', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $payload = [
        'name' => 'Learn Programming',
        'start_date' => today()->toDateString(),
        'deadline' => today()->addMonths(3)->toDateString(),
        'habit_ids' => [$habit->id],
    ];

    $response = $this->actingAs($user)
        ->from(route('goals.index'))
        ->post(route('goals.store'), $payload);

    $response->assertRedirect(route('goals.index'));

    $this->assertDatabaseHas('goals', [
        'user_id' => $user->id,
        'name' => 'Learn Programming',
    ]);

    $goal = Goal::where('name', 'Learn Programming')->first();
    expect($goal->habits)->toHaveCount(1);
    expect($goal->habits->first()->id)->toBe($habit->id);
});

test('user can view a specific goal', function () {
    $user = User::factory()->create();
    $goal = Goal::factory()->for($user)->create();

    $this->actingAs($user)
        ->get(route('goals.show', $goal))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/show')
            ->has('goal.id')
        );
});

test('user cannot view another users goal', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $goal = Goal::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->get(route('goals.show', $goal))
        ->assertForbidden();
});
