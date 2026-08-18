<?php

use App\Models\Habit;
use App\Models\HabitCompletion;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard only displays habits owned by the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownedHabit = Habit::factory()
        ->for($user)
        ->create([
            'name' => 'Owned Habit',
        ]);

    Habit::factory()
        ->for($otherUser)
        ->create([
            'name' => 'Other Habit',
        ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('habits', 1)
            ->where('habits.0.id', $ownedHabit->id)
            ->where('habits.0.name', 'Owned Habit'),
        );
});

test('dashboard only includes completions from the last seven days', function () {
    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $includedCompletion = HabitCompletion::factory()
        ->for($habit)
        ->create([
            'completed_on' => today()->subDays(6),
        ]);

    HabitCompletion::factory()
        ->for($habit)
        ->create([
            'completed_on' => today()->subDays(7),
        ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('habits', 1)
            ->has('habits.0.completions', 1)
            ->where(
                'habits.0.completions.0.id',
                $includedCompletion->id,
            ),
        );
});

test('authenticated user can create a daily habit', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('habits.store'), [
            'name' => 'Read Books',
            'description' => 'Read every evening',
            'category' => 'Learning',
            'target_value' => 20,
            'unit' => 'pages',
            'frequency' => 'daily',
            'days_of_week' => [1, 3],
            'is_active' => true,
            'start_date' => today()->toDateString(),
        ]);

    $response
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('habits', [
        'user_id' => $user->id,
        'name' => 'Read Books',
        'frequency' => 'daily',
        'days_of_week' => null,
        'is_active' => true,
    ]);
});

test('habit owner can update their habit', function () {
    $user = User::factory()->create();

    $habit = Habit::factory()
        ->for($user)
        ->create([
            'name' => 'Old Habit',
            'frequency' => 'daily',
            'days_of_week' => null,
        ]);

    $response = $this->actingAs($user)
        ->put(route('habits.update', $habit), [
            'name' => 'Exercise',
            'description' => 'Exercise every Monday, Wednesday, and Friday',
            'category' => 'Health',
            'target_value' => 30,
            'unit' => 'minutes',
            'frequency' => 'weekly',
            'days_of_week' => [1, 3, 5],
            'is_active' => true,
            'start_date' => today()->toDateString(),
        ]);

    $response
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('habits', [
        'id' => $habit->id,
        'user_id' => $user->id,
        'name' => 'Exercise',
        'frequency' => 'weekly',
    ]);

    expect($habit->refresh()->days_of_week)->toBe([1, 3, 5]);
});

test('habit owner can delete their habit', function () {
    $user = User::factory()->create();

    $habit = Habit::factory()
        ->for($user)
        ->create();

    $response = $this->actingAs($user)
        ->delete(route('habits.destroy', $habit));

    $response->assertRedirect(route('dashboard'));

    $this->assertSoftDeleted('habits', [
        'id' => $habit->id,
        'user_id' => $user->id,
    ]);
});

test('user cannot update a habit owned by another user', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();

    $habit = Habit::factory()
        ->for($owner)
        ->create([
            'name' => 'Protected Habit',
        ]);

    $response = $this->actingAs($user)
        ->put(route('habits.update', $habit), [
            'name' => 'Changed By Another User',
            'description' => null,
            'category' => 'Health',
            'target_value' => 30,
            'unit' => 'minutes',
            'frequency' => 'daily',
            'days_of_week' => null,
            'is_active' => true,
            'start_date' => today()->toDateString(),
        ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('habits', [
        'id' => $habit->id,
        'user_id' => $owner->id,
        'name' => 'Protected Habit',
    ]);
});

test('user cannot delete a habit owned by another user', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();

    $habit = Habit::factory()
        ->for($owner)
        ->create();

    $response = $this->actingAs($user)
        ->delete(route('habits.destroy', $habit));

    $response->assertForbidden();

    $this->assertNotSoftDeleted('habits', [
        'id' => $habit->id,
        'user_id' => $owner->id,
    ]);
});

test('habit creation requires mandatory fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('habits.store'), []);

    $response->assertSessionHasErrors([
        'name',
        'frequency',
        'start_date',
    ]);

    $this->assertDatabaseCount('habits', 0);
});

test('weekly habit requires at least one day of week', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('habits.store'), [
            'name' => 'Weekly Exercise',
            'frequency' => 'weekly',
            'start_date' => today()->toDateString(),
        ]);

    $response->assertSessionHasErrors([
        'days_of_week',
    ]);

    $this->assertDatabaseCount('habits', 0);
});

test('weekly habit rejects invalid days of week', function (array $daysOfWeek) {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('habits.store'), [
            'name' => 'Weekly Exercise',
            'frequency' => 'weekly',
            'days_of_week' => $daysOfWeek,
            'start_date' => today()->toDateString(),
        ]);

    $response->assertSessionHasErrors([
        'days_of_week.0',
    ]);

    $this->assertDatabaseCount('habits', 0);
})->with([
    'day outside allowed range' => [[7]],
    'duplicate days' => [[1, 1]],
]);

test(
    'habit creation validates measurement fields',
    function (array $overrides, string $errorField) {
        $user = User::factory()->create();

        $payload = [
            'name' => 'Read Books',
            'target_value' => 20,
            'unit' => 'pages',
            'frequency' => 'daily',
            'start_date' => today()->toDateString(),
        ];

        $response = $this->actingAs($user)
            ->post(
                route('habits.store'),
                array_replace($payload, $overrides),
            );

        $response->assertSessionHasErrors([
            $errorField,
        ]);

        $this->assertDatabaseCount('habits', 0);
    },
)->with([
    'unit without target value' => [
        ['target_value' => null, 'unit' => 'pages'],
        'target_value',
    ],
    'target value without unit' => [
        ['target_value' => 20, 'unit' => null],
        'unit',
    ],
    'non numeric target value' => [
        ['target_value' => 'many', 'unit' => 'pages'],
        'target_value',
    ],
    'target value below minimum' => [
        ['target_value' => 0, 'unit' => 'pages'],
        'target_value',
    ],
    'target value above maximum' => [
        ['target_value' => 1000000, 'unit' => 'pages'],
        'target_value',
    ],
]);
