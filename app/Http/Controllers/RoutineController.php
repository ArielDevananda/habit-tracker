<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoutineRequest;
use App\Http\Requests\UpdateRoutineRequest;
use App\Models\Routine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoutineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Routine::class);

        $routines = $request->user()
            ->routines()
            ->with('habits')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('routines/index', [
            'routines' => $routines,
            'habits' => $request->user()->habits()->select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoutineRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $routine = $request->user()->routines()->create(
            collect($validated)->except('habit_ids')->toArray()
        );

        if (isset($validated['habit_ids']) && is_array($validated['habit_ids'])) {
            $syncData = [];
            foreach ($validated['habit_ids'] as $index => $habitId) {
                $syncData[$habitId] = ['order' => $index];
            }
            $routine->habits()->sync($syncData);
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Routine $routine): Response
    {
        Gate::authorize('view', $routine);

        $routine->load('habits');

        return Inertia::render('routines/show', [
            'routine' => $routine,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoutineRequest $request, Routine $routine): RedirectResponse
    {
        $validated = $request->validated();

        $routine->update(
            collect($validated)->except('habit_ids')->toArray()
        );

        if (isset($validated['habit_ids']) && is_array($validated['habit_ids'])) {
            $syncData = [];
            foreach ($validated['habit_ids'] as $index => $habitId) {
                $syncData[$habitId] = ['order' => $index];
            }
            $routine->habits()->sync($syncData);
        }

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Routine $routine): RedirectResponse
    {
        Gate::authorize('delete', $routine);

        $routine->delete();

        return to_route('routines.index');
    }
}
