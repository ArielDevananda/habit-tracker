<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Habit;

foreach (Habit::all() as $habit) {
    $habit->recalculateStreak();
    echo "Habit {$habit->id}: Current {$habit->current_streak}, Longest {$habit->longest_streak}\n";
}
