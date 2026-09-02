<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\HabitReminderNotification;
use Illuminate\Console\Command;

class SendHabitReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-habit-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily habit reminders to users who have uncompleted habits.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $today = today();

        // Get all users who have active daily habits
        $users = User::whereHas('habits', function ($query) {
            $query->where('status', 'active')
                ->where('frequency', 'daily');
        })->with(['habits' => function ($query) {
            $query->where('status', 'active')
                ->where('frequency', 'daily');
        }, 'habits.completions' => function ($query) use ($today) {
            $query->whereDate('completed_on', $today);
        }])->get();

        $count = 0;

        foreach ($users as $user) {
            $uncompletedCount = 0;

            foreach ($user->habits as $habit) {
                // If the habit doesn't have a completion for today
                if ($habit->completions->isEmpty()) {
                    // Make sure it started before or on today
                    if ($habit->start_date <= $today) {
                        $uncompletedCount++;
                    }
                }
            }

            if ($uncompletedCount > 0) {
                $user->notify(new HabitReminderNotification(
                    "You have {$uncompletedCount} uncompleted habits today. Don't break the chain!",
                    '/dashboard',
                    'reminder'
                ));
                $count++;
            }
        }

        $this->info("Sent reminders to {$count} users.");
    }
}
