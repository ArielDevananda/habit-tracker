<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Achievement::insert([
            [
                'type' => '7_day_streak',
                'name' => '7-Day Streak',
                'description' => 'Complete the same habit for seven consecutive scheduled days.',
                'icon' => 'Flame',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'perfect_week',
                'name' => 'Perfect Week',
                'description' => 'Complete 100% of scheduled habits during a calendar week.',
                'icon' => 'Star',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'high_achiever',
                'name' => 'High Achiever',
                'description' => 'Achieve at least 80% consistency with a minimum of 20 scheduled check-ins.',
                'icon' => 'Trophy',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
