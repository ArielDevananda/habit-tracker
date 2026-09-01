<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Habit;
use Carbon\Carbon;

$habit = Habit::first(); // Assuming ID 1 exists

function calculateStreak(Habit $habit) {
    $completions = $habit->completions()->orderBy('completed_on')->get();
    
    // Map completed dates that meet the target value
    $completedDates = [];
    foreach ($completions as $c) {
        $isSuccess = false;
        if (in_array($habit->type, ['binary', 'avoid'])) {
            $isSuccess = true;
        } else {
            $isSuccess = $c->value >= ($habit->target_value ?? 1);
        }
        
        if ($isSuccess) {
            $completedDates[] = Carbon::parse($c->completed_on)->format('Y-m-d');
        }
    }
    
    // Generate all scheduled dates from start_date to today
    $startDate = Carbon::parse($habit->start_date)->startOfDay();
    $today = Carbon::today();
    
    $scheduledDates = [];
    $current = $startDate->copy();
    while ($current->lte($today)) {
        $add = false;
        if ($habit->frequency === 'daily') {
            $add = true;
        } elseif ($habit->frequency === 'weekly' && is_array($habit->days_of_week)) {
            // Carbon dayOfWeek: 0 = Sunday, 1 = Monday ... 6 = Saturday
            if (in_array($current->dayOfWeek, $habit->days_of_week)) {
                $add = true;
            }
        }
        
        if ($add) {
            $scheduledDates[] = $current->format('Y-m-d');
        }
        $current->addDay();
    }
    
    // Calculate streak
    $currentStreak = 0;
    $longestStreak = 0;
    $tempStreak = 0;
    
    $todayStr = $today->format('Y-m-d');
    
    // Reverse scheduled dates to count current streak easily
    $scheduledDatesRev = array_reverse($scheduledDates);
    
    foreach ($scheduledDatesRev as $index => $date) {
        if (in_array($date, $completedDates)) {
            $currentStreak++;
        } else {
            // If it's today and not completed, it doesn't break the streak YET.
            if ($date === $todayStr) {
                continue; // Skip breaking streak if it's today
            }
            break; // Streak broken
        }
    }
    
    // Calculate longest streak
    foreach ($scheduledDates as $date) {
        if (in_array($date, $completedDates)) {
            $tempStreak++;
            if ($tempStreak > $longestStreak) {
                $longestStreak = $tempStreak;
            }
        } else {
            $tempStreak = 0;
        }
    }
    
    return ['current' => $currentStreak, 'longest' => $longestStreak];
}

var_dump(calculateStreak($habit));

