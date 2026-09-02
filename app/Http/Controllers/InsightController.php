<?php

namespace App\Http\Controllers;

use App\Models\HabitCompletion;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class InsightController extends Controller
{
    /**
     * Display the insights page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $habits = $user->habits()->with('completions')->get();

        $insights = [];

        if ($habits->isEmpty()) {
            return Inertia::render('insights/index', [
                'insights' => [],
            ]);
        }

        // 1. Most Consistent Habit
        $mostConsistent = $habits->sortByDesc('current_streak')->first();
        if ($mostConsistent && $mostConsistent->current_streak > 0) {
            $insights[] = [
                'title' => 'Most Consistent Habit',
                'description' => "You're on a {$mostConsistent->current_streak}-day streak with '{$mostConsistent->name}'. Keep it up!",
                'type' => 'positive',
                'icon' => 'Flame',
            ];
        }

        // 2. Best Day of the Week
        $completions = HabitCompletion::whereHas('habit', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        if ($completions->isNotEmpty()) {
            $dayCounts = $completions->groupBy(function ($c) {
                return Carbon::parse($c->completed_on)->format('l'); // e.g., 'Monday'
            })->map->count();

            $bestDay = $dayCounts->sortDesc()->keys()->first();
            $insights[] = [
                'title' => 'Best Performing Day',
                'description' => "You tend to complete the most habits on {$bestDay}s.",
                'type' => 'info',
                'icon' => 'Calendar',
            ];
        }

        // 3. Overall Completion Rate (last 30 days vs previous 30 days)
        $last30Days = $completions->where('completed_on', '>=', now()->subDays(30)->startOfDay())->count();
        $prev30Days = $completions->whereBetween('completed_on', [now()->subDays(60)->startOfDay(), now()->subDays(31)->endOfDay()])->count();

        if ($prev30Days > 0) {
            $growth = (($last30Days - $prev30Days) / $prev30Days) * 100;
            if ($growth > 0) {
                $insights[] = [
                    'title' => 'Upward Trend',
                    'description' => 'Your habit completion is up by '.round($growth).'% compared to the previous month.',
                    'type' => 'positive',
                    'icon' => 'TrendingUp',
                ];
            } elseif ($growth < 0) {
                $insights[] = [
                    'title' => 'Room for Improvement',
                    'description' => 'Your habit completion is down by '.round(abs($growth))."% this month. You've got this!",
                    'type' => 'warning',
                    'icon' => 'TrendingDown',
                ];
            }
        }

        // 4. Time of Day pattern (rough estimate based on created_at of completion, though completed_on is just a date, created_at has time)
        $morningCompletions = $completions->filter(function ($c) {
            return Carbon::parse($c->created_at)->hour < 12;
        })->count();

        $eveningCompletions = $completions->filter(function ($c) {
            return Carbon::parse($c->created_at)->hour >= 17;
        })->count();

        if ($morningCompletions > $eveningCompletions * 2 && $morningCompletions > 5) {
            $insights[] = [
                'title' => 'Morning Person',
                'description' => 'You are most active in the mornings. Consider scheduling difficult habits before noon.',
                'type' => 'info',
                'icon' => 'Sun',
            ];
        } elseif ($eveningCompletions > $morningCompletions * 2 && $eveningCompletions > 5) {
            $insights[] = [
                'title' => 'Night Owl',
                'description' => 'You tend to check off your habits in the evening.',
                'type' => 'info',
                'icon' => 'Moon',
            ];
        }

        return Inertia::render('insights/index', [
            'insights' => $insights,
        ]);
    }
}
