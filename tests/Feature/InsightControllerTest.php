<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can view insights', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('insights.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('insights/index')
            ->has('insights')
        );
});
