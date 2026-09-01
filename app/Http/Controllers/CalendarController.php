<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $year = $request->input('year', today()->year);
        $month = $request->input('month', today()->month);

        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        $habits = Habit::where('user_id', $request->user()->id)
            ->with(['completions' => function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereBetween('completed_on', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')]);
            }])
            ->get();

        return Inertia::render('calendar', [
            'habits' => $habits,
            'currentYear' => (int) $year,
            'currentMonth' => (int) $month,
        ]);
    }
}
