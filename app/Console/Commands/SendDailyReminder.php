<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\HabitReminderNotification;
use Illuminate\Console\Command;

class SendDailyReminder extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reminder:daily';

    /**
     * The console command description.
     */
    protected $description = 'Send daily habit reminder notifications to all subscribed users';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $users = User::whereHas('pushSubscriptions')->get();

        if ($users->isEmpty()) {
            $this->info('No subscribed users found.');

            return self::SUCCESS;
        }

        $today = today();
        $sent = 0;

        foreach ($users as $user) {
            $habits = $user->habits()
                ->where('is_active', true)
                ->get();

            if ($habits->isEmpty()) {
                continue;
            }

            // Count how many habits are not yet completed today
            $pending = $habits->filter(function ($habit) use ($today) {
                // Check start date
                if ($habit->start_date && $habit->start_date->copy()->startOfDay()->gt($today)) {
                    return false;
                }

                // Check frequency
                if ($habit->frequency === 'weekly' && $habit->days_of_week) {
                    if (! in_array((string) $today->dayOfWeek, $habit->days_of_week)) {
                        return false; // Not required today
                    }
                }

                return ! $habit->completions()
                    ->whereDate('completed_on', $today)
                    ->exists();
            });

            if ($pending->isEmpty()) {
                continue; // All done for today
            }

            $count = $pending->count();
            $message = $count === 1
                ? "You have 1 habit to complete today. Let's go! 💪"
                : "You have {$count} habits to complete today. Let's go! 💪";

            $user->notify(new HabitReminderNotification($message));
            $sent++;
        }

        $this->info("Sent daily reminders to {$sent} user(s).");

        return self::SUCCESS;
    }
}
