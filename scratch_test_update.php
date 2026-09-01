<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$habit = App\Models\Habit::first();
echo "Before: " . $habit->name . "\n";
$habit->update(['name' => 'Updated Name ' . time()]);
$habit->refresh();
echo "After: " . $habit->name . "\n";
