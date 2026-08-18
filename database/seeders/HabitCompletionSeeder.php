<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class HabitCompletionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()
            ->with('habits')
            ->where('email', 'test@example.com')
            ->firstOrFail();

        foreach ($user->habits as $habit) {
            foreach (range(0, 6) as $daysAgo) {
                if (($habit->id + $daysAgo) % 4 === 0) {
                    continue;
                }

                $habit->completions()->updateOrCreate(
                    [
                        'completed_on' => today()->subDays($daysAgo),
                    ],
                    [
                        'value' => $habit->target_value,
                        'note' => null,
                    ],
                );
            }
        }
    }
}
