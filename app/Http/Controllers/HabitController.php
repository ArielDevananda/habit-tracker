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
}
