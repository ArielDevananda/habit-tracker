<?php

use App\Http\Controllers\HabitController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PushSubscriptionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [HabitController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('habits/export', [HabitController::class, 'export'])
        ->name('habits.export');

    Route::resource('habits', HabitController::class)
        ->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::post('habits/{habit}/toggle', [HabitController::class, 'toggle'])
        ->name('habits.toggle');
    Route::post('habits/{habit}/value', [HabitController::class, 'updateValue'])
        ->name('habits.value');

    Route::get('/analytics', [HabitController::class, 'analytics'])->name('analytics');
    Route::get('/calendar', [\App\Http\Controllers\CalendarController::class, 'index'])->name('calendar');

    // Notifications
    Route::post('/api/push-subscribe', [PushSubscriptionController::class, 'update'])->name('push.subscribe');
    Route::delete('/api/push-subscribe', [PushSubscriptionController::class, 'destroy'])->name('push.unsubscribe');
    Route::get('/api/notifications/unread', [NotificationController::class, 'unread'])->name('notifications.unread');
    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
});

require __DIR__.'/settings.php';
