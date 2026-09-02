<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class HabitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()
            ->where('email', 'test@example.com')
            ->firstOrFail();

        $habits = [
            [
                'name' => 'Drink Water',
                'description' => 'Drink enough water throughout the day.',
                'category' => 'Health',
                'target_value' => 8,
                'unit' => 'glasses',
                'frequency' => 'daily',
                'days_of_week' => null,
                'status' => 'active',
                'start_date' => today()->subDays(30),
            ],
            [
                'name' => 'Read a Book',
                'description' => 'Read a book every day.',
                'category' => 'Learning',
                'target_value' => 20,
                'unit' => 'pages',
                'frequency' => 'daily',
                'days_of_week' => null,
                'status' => 'active',
                'start_date' => today()->subDays(30),
            ],
            [
                'name' => 'Morning Exercise',
                'description' => 'Exercise before starting the day.',
                'category' => 'Fitness',
                'target_value' => 30,
                'unit' => 'minutes',
                'frequency' => 'daily',
                'days_of_week' => null,
                'status' => 'active',
                'start_date' => today()->subDays(30),
            ],
            [
                'name' => 'Meditation',
                'description' => 'Take time to calm the mind.',
                'category' => 'Mindfulness',
                'target_value' => 10,
                'unit' => 'minutes',
                'frequency' => 'daily',
                'days_of_week' => null,
                'status' => 'active',
                'start_date' => today()->subDays(30),
            ],
            [
                'name' => 'Wake Up Early',
                'description' => 'Wake up before 6 AM.',
                'category' => 'Health',
                'target_value' => null,
                'unit' => null,
                'frequency' => 'daily',
                'days_of_week' => null,
                'status' => 'active',
                'start_date' => today()->subDays(30),
            ],
        ];

        foreach ($habits as $habit) {
            $user->habits()->updateOrCreate(
                ['name' => $habit['name']],
                $habit,
            );
        }
    }
}
