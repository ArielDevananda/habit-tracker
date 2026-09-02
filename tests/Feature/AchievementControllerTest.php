<?php

use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can view achievements', function () {
    $this->seed(AchievementSeeder::class);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('achievements.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('achievements/index')
            ->has('achievements', 3)
        );
});
