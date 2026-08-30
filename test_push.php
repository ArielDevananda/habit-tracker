<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$user->notify(new App\Notifications\HabitReminderNotification('Halo, ini uji coba notifikasi!'));
echo "Push dispatched to queue.\n";
