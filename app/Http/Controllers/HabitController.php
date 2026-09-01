<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHabitRequest;
use App\Http\Requests\UpdateHabitRequest;
use App\Models\Habit;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
                'type',
                'status',
                'start_date',
                'current_streak',
                'longest_streak',
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
                        now()->startOfWeek()->format('Y-m-d'),
                        now()->endOfWeek()->format('Y-m-d'),
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
                'type',
                'status',
                'start_date',
                'current_streak',
                'longest_streak',
            ])
            ->withCount('completions')
            ->latest('id')
            ->get();

        return Inertia::render('habits/index', [
            'habits' => $habits,
        ]);
    }

    /**
     * Display a single habit's statistics.
     */
    public function show(Request $request, Habit $habit): Response
    {
        Gate::authorize('view', $habit);

        $habit->load([
            'completions' => fn (HasMany $query) => $query
                ->select([
                    'id',
                    'habit_id',
                    'completed_on',
                    'value',
                    'note',
                ])
                ->whereBetween('completed_on', [
                    today()->subDays(90),
                    today()->endOfDay(),
                ])
                ->oldest('completed_on'),
        ]);

        $habit->loadCount('completions as total_completions');

        return Inertia::render('habits/show', [
            'habit' => $habit,
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

        return back();
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

        return back();
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

        return back();
    }

    /**
     * Toggle the completion status of the habit for today.
     */
    public function toggle(Request $request, Habit $habit): RedirectResponse
    {
        Gate::authorize('update', $habit);

        $dateStr = $request->input('date');
        $targetDate = $dateStr ? Carbon::parse($dateStr)->startOfDay() : today();

        $completion = $habit->completions()
            ->whereDate('completed_on', $targetDate)
            ->first();

        if ($completion) {
            $completion->delete();
            $message = __('Habit marked as incomplete.');
        } else {
            $habit->completions()->create([
                'completed_on' => $targetDate,
                'value' => $habit->target_value ?? '1',
            ]);
            $message = __('Habit completed!');
        }

        $habit->recalculateStreak();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $message,
        ]);

        return back();
    }

    /**
     * Update the exact completion value of the habit for a specific date.
     */
    public function updateValue(Request $request, Habit $habit): RedirectResponse
    {
        Gate::authorize('update', $habit);

        $request->validate([
            'date' => ['nullable', 'date'],
            'value' => ['required', 'numeric', 'min:0'],
        ]);

        $dateStr = $request->input('date');
        $targetDate = $dateStr ? Carbon::parse($dateStr)->startOfDay() : today();
        $value = (float) $request->input('value');

        if ($value <= 0) {
            $habit->completions()->whereDate('completed_on', $targetDate)->delete();
        } else {
            $habit->completions()->updateOrCreate(
                ['completed_on' => $targetDate],
                ['value' => $value]
            );
        }

        $habit->recalculateStreak();

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
                'type',
                'status',
                'start_date',
                'current_streak',
                'longest_streak',
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

    /**
     * Export habit completion data as CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', Habit::class);

        $habits = $request->user()
            ->habits()
            ->with(['completions' => fn (HasMany $query) => $query->oldest('completed_on')])
            ->get();

        $fileName = 'habit-tracker-export-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($habits) {
            $handle = fopen('php://output', 'w');

            // CSV Header
            fputcsv($handle, ['Habit Name', 'Category', 'Frequency', 'Completed On', 'Value', 'Note']);

            foreach ($habits as $habit) {
                foreach ($habit->completions as $completion) {
                    fputcsv($handle, [
                        $habit->name,
                        $habit->category ?? 'General',
                        $habit->frequency,
                        $completion->completed_on->format('Y-m-d'),
                        $completion->value,
                        $completion->note ?? '',
                    ]);
                }
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
