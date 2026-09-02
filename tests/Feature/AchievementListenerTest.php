<?php

use App\Events\HabitCompleted;
use App\Models\Habit;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Illuminate\Support\Facades\Event;

test('achievements listener unlocks 7-day streak', function () {
    $this->seed(AchievementSeeder::class);

    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create([
        'current_streak' => 7,
    ]);

    event(new HabitCompleted($user, $habit));

    $this->assertDatabaseHas('user_achievements', [
        'user_id' => $user->id,
    ]);

    $user->refresh();
    expect($user->achievements->pluck('type')->toArray())->toContain('7_day_streak');
});

test('achievements listener unlocks high achiever', function () {
    $this->seed(AchievementSeeder::class);

    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create([
        'start_date' => now()->subDays(20),
        'status' => 'active',
    ]);

    // Create 20 completions
    for ($i = 0; $i < 20; $i++) {
        $habit->completions()->create([
            'completed_on' => now()->subDays($i),
            'value' => '1',
        ]);
    }

    event(new HabitCompleted($user, $habit));

    $user->refresh();
    expect($user->achievements->pluck('type')->toArray())->toContain('high_achiever');
});

test('listener is dispatched on habit toggle', function () {
    Event::fake([HabitCompleted::class]);

    $user = User::factory()->create();
    $habit = Habit::factory()->for($user)->create();

    $this->actingAs($user)
        ->from('/dashboard')
        ->post(route('habits.toggle', $habit));

    Event::assertDispatched(HabitCompleted::class);
});
