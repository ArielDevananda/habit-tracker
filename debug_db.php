<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$habits = App\Models\Habit::select('id','name','start_date')->get();
$comps = App\Models\HabitCompletion::select('habit_id', 'completed_on')->get();

echo "HABITS:\n";
print_r($habits->toArray());
echo "COMPLETIONS:\n";
print_r($comps->toArray());
