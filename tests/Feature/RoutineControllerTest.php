<?php

use App\Models\Habit;
use App\Models\Routine;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can view routines index', function () {
    $user = User::factory()->create();

    $routine = Routine::factory()->for($user)->create([
        'name' => 'Morning Routine',
    ]);

    $this->actingAs($user)
        ->get(route('routines.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('routines/index')
            ->has('routines', 1)
            ->where('routines.0.name', 'Morning Routine')
        );
});

test('authenticated user can create a routine', function () {
    $user = User::factory()->create();
    $habit1 = Habit::factory()->for($user)->create();
    $habit2 = Habit::factory()->for($user)->create();

    $payload = [
        'name' => 'Evening Routine',
        'habit_ids' => [$habit2->id, $habit1->id],
    ];

    $response = $this->actingAs($user)
        ->from(route('routines.index'))
        ->post(route('routines.store'), $payload);

    $response->assertRedirect(route('routines.index'));

    $this->assertDatabaseHas('routines', [
        'user_id' => $user->id,
        'name' => 'Evening Routine',
    ]);

    $routine = Routine::where('name', 'Evening Routine')->first();
    expect($routine->habits)->toHaveCount(2);
    // Ensure order is preserved
    expect($routine->habits[0]->id)->toBe($habit2->id);
    expect($routine->habits[0]->pivot->order)->toBe(0);
    expect($routine->habits[1]->id)->toBe($habit1->id);
    expect($routine->habits[1]->pivot->order)->toBe(1);
});
