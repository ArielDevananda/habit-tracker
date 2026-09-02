<?php

namespace App\Listeners;

use App\Events\HabitCompleted;
use App\Models\Achievement;
use App\Models\Habit;
use App\Models\HabitCompletion;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;

class CheckAchievements implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(HabitCompleted $event): void
    {
        $user = $event->user;
        $habit = $event->habit;

        $unlockedIds = $user->achievements()->pluck('achievements.id')->toArray();
        $achievements = Achievement::all()->keyBy('type');

        // 1. 7-Day Streak
        if ($habit->current_streak >= 7) {
            $this->unlockAchievement($user, $achievements->get('7_day_streak'), $unlockedIds);
        }

        // 2. High Achiever
        // Achieve at least 80% consistency with a minimum of 20 scheduled check-ins.
        // For MVP simplicity: we count total completions. If > 20, check consistency.
        $totalCompletions = $user->habits()->withCount('completions')->get()->sum('completions_count');

        if ($totalCompletions >= 20) {
            // Calculate total days since the user started using the app (earliest habit start date)
            $earliestHabit = $user->habits()->orderBy('start_date')->first();
            if ($earliestHabit) {
                $daysSinceStart = Carbon::parse($earliestHabit->start_date)->diffInDays(now()) + 1;
                // If days > 0, we can rough-estimate global consistency
                // A better approach is simply totalCompletions / (daysSinceStart * activeHabitsCount)
                $activeHabitsCount = $user->habits()->where('status', 'active')->count() ?: 1;
                $expectedCompletions = $daysSinceStart * $activeHabitsCount;

                $consistency = $expectedCompletions > 0 ? ($totalCompletions / $expectedCompletions) : 0;

                if ($consistency >= 0.8) {
                    $this->unlockAchievement($user, $achievements->get('high_achiever'), $unlockedIds);
                }
            }
        }

        // 3. Perfect Week
        // If the user has completed all habits scheduled for today for the last 7 days?
        // For MVP, let's just do a simpler check: 7 completions in the last 7 days for all active daily habits.
        // Or if the user has >= (active daily habits * 7) completions this week.
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        // Count completions this week
        $completionsThisWeek = HabitCompletion::whereHas('habit', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->whereBetween('completed_on', [$startOfWeek, $endOfWeek])->count();

        // Expected completions this week (rough estimate for MVP)
        $expectedThisWeek = 0;
        foreach ($user->habits()->where('status', 'active')->get() as $h) {
            if ($h->frequency === 'daily') {
                $expectedThisWeek += 7;
            } elseif ($h->frequency === 'weekly') {
                $expectedThisWeek += 1; // Assuming 1 per week
            } elseif ($h->frequency === 'specific_days' && is_array($h->days_of_week)) {
                $expectedThisWeek += count($h->days_of_week);
            }
        }

        if ($expectedThisWeek > 0 && $completionsThisWeek >= $expectedThisWeek) {
            $this->unlockAchievement($user, $achievements->get('perfect_week'), $unlockedIds);
        }
    }

    /**
     * @param  array<int>  $unlockedIds
     */
    private function unlockAchievement(User $user, ?Achievement $achievement, array &$unlockedIds): void
    {
        if ($achievement && ! in_array($achievement->id, $unlockedIds)) {
            $user->achievements()->attach($achievement->id);
            $unlockedIds[] = $achievement->id;

            // In the future, we could trigger an AchievementUnlocked event here
            // to show a flash notification to the user.
        }
    }
}
