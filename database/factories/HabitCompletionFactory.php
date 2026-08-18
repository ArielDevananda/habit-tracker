<?php

namespace Database\Factories;

use App\Models\Habit;
use App\Models\HabitCompletion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HabitCompletion>
 */
class HabitCompletionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'habit_id' => Habit::factory(),
            'completed_on' => fake()
                ->dateTimeBetween('-30 days', 'now')
                ->format('Y-m-d'),
            'value' => fake()->optional()->randomFloat(2, 1, 100),
            'note' => fake()->optional()->sentence(),
        ];
    }
}
