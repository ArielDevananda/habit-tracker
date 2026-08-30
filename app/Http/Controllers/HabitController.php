<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHabitRequest;
use App\Http\Requests\UpdateHabitRequest;
use App\Models\Habit;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class HabitController extends Controller
{
    /**
     * Display the habit dashboard.
     */
    public function dashboard(Request $request): Response
    {
        Gate::authorize('viewAny', Habit::class);

        $habits = $request->user()
            ->habits()
            ->select([
                'id',
                'name',
                'description',
                'category',
                'target_value',
                'unit',
                'frequency',
                'days_of_week',
                'is_active',
                'start_date',
            ])
            ->with([
                'completions' => fn (HasMany $query) => $query
                    ->select([
                        'id',
                        'habit_id',
                        'completed_on',
                        'value',
                        'note',
                    ])
                    ->whereBetween('completed_on', [
                        today()->subDays(6),
                        today()->endOfDay(),
                    ])
                    ->oldest('completed_on'),
            ])
            ->latest('id')
            ->get();

        return Inertia::render('dashboard', [
            'habits' => $habits,
        ]);
    }

    /**
     * Display a listing of the habits.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Habit::class);

        $habits = $request->user()
            ->habits()
            ->select([
                'id',
                'name',
                'description',
                'category',
                'target_value',
                'unit',
                'frequency',
                'days_of_week',
                'is_active',
                'start_date',
            ])
            ->withCount('completions')
            ->latest('id')
            ->get();

        return Inertia::render('habits/index', [
            'habits' => $habits,
        ]);
    }

    /**
     * Store a newly created habit.
     */
    public function store(StoreHabitRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['days_of_week'] = $data['frequency'] === 'weekly'
            ? $data['days_of_week']
            : null;

        $request->user()->habits()->create($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Habit created.'),
        ]);

        return to_route('dashboard');
    }

    /**
     * Update the specified habit.
     */
    public function update(
        UpdateHabitRequest $request,
        Habit $habit,
    ): RedirectResponse {
        $data = $request->validated();
        $data['days_of_week'] = $data['frequency'] === 'weekly'
            ? $data['days_of_week']
            : null;

        $habit->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Habit updated.'),
        ]);

        return to_route('dashboard');
    }

    /**
     * Remove the specified habit.
     */
    public function destroy(Request $request, Habit $habit): RedirectResponse
    {
        Gate::authorize('delete', $habit);

        $habit->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Habit deleted.'),
        ]);

        return to_route('dashboard');
    }

    /**
     * Toggle the completion status of the habit for today.
     */
    public function toggle(Request $request, Habit $habit): RedirectResponse
    {
        Gate::authorize('update', $habit);

        $today = today();
        
        $completion = $habit->completions()
            ->whereDate('completed_on', $today)
            ->first();

        if ($completion) {
            $completion->delete();
            $message = __('Habit marked as incomplete.');
        } else {
            $habit->completions()->create([
                'completed_on' => $today,
                'value' => $habit->target_value ?? '1',
            ]);
            $message = __('Habit completed!');
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $message,
        ]);

        return back();
    }

    /**
     * Display the analytics page.
     */
    public function analytics(Request $request): Response
    {
        Gate::authorize('viewAny', Habit::class);

        $habits = $request->user()
            ->habits()
            ->select([
                'id',
                'name',
                'description',
                'category',
                'target_value',
                'unit',
                'frequency',
                'days_of_week',
                'is_active',
                'start_date',
            ])
            ->with([
                'completions' => fn (HasMany $query) => $query
                    ->select([
                        'id',
                        'habit_id',
                        'completed_on',
                        'value',
                        'note',
                    ])
                    ->whereBetween('completed_on', [
                        today()->subDays(30),
                        today()->endOfDay(),
                    ])
                    ->oldest('completed_on'),
            ])
            ->get();

        return Inertia::render('analytics', [
            'habits' => $habits,
        ]);
    }
}
