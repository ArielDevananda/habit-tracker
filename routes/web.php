<?php

use App\Http\Controllers\HabitController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [HabitController::class, 'index'])
        ->name('dashboard');

    Route::resource('habits', HabitController::class)
        ->only(['store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
