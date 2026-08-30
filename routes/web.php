<?php

use App\Http\Controllers\HabitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [HabitController::class, 'dashboard'])
        ->name('dashboard');

    Route::resource('habits', HabitController::class)
        ->only(['index', 'store', 'update', 'destroy']);
        
    Route::post('habits/{habit}/toggle', [HabitController::class, 'toggle'])
        ->name('habits.toggle');

    Route::get('/analytics', [HabitController::class, 'analytics'])->name('analytics');

    // Notifications
    Route::get('/api/notifications/unread', [\App\Http\Controllers\NotificationController::class, 'unread'])->name('notifications.unread');
    Route::post('/api/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/api/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
});

require __DIR__.'/settings.php';
