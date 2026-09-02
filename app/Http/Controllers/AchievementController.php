<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    /**
     * Display the achievements page.
     */
    public function index(Request $request): Response
    {
        $allAchievements = Achievement::all();
        $userUnlockedIds = $request->user()->achievements()->pluck('achievements.id')->toArray();

        $achievements = $allAchievements->map(function ($achievement) use ($userUnlockedIds) {
            return [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'unlocked' => in_array($achievement->id, $userUnlockedIds),
            ];
        });

        return Inertia::render('achievements/index', [
            'achievements' => $achievements,
        ]);
    }
}
