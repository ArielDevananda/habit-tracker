<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Goal::class);

        $goals = $request->user()
            ->goals()
            ->with('habits')
            ->orderBy('deadline', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('goals/index', [
            'goals' => $goals,
            'habits' => $request->user()->habits()->select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGoalRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $goal = $request->user()->goals()->create(
            collect($validated)->except('habit_ids')->toArray()
        );

        if (isset($validated['habit_ids'])) {
            $goal->habits()->sync($validated['habit_ids']);
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Goal $goal): Response
    {
        Gate::authorize('view', $goal);

        $goal->load('habits');

        return Inertia::render('goals/show', [
            'goal' => $goal,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGoalRequest $request, Goal $goal): RedirectResponse
    {
        $validated = $request->validated();

        $goal->update(
            collect($validated)->except('habit_ids')->toArray()
        );

        if (isset($validated['habit_ids'])) {
            $goal->habits()->sync($validated['habit_ids']);
        }

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Goal $goal): RedirectResponse
    {
        Gate::authorize('delete', $goal);

        $goal->delete();

        return to_route('goals.index');
    }
}
