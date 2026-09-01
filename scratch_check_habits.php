<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (App\Models\Habit::latest()->take(3)->get() as $h) {
    echo $h->id . ' | ' . $h->name . ' | ' . $h->frequency . ' | start: ' . $h->start_date . ' | days: ' . json_encode($h->days_of_week) . PHP_EOL;
}
