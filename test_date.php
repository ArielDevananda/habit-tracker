<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo config('app.timezone') . "\n";
$h = App\Models\Habit::find(16);
echo "Raw DB: " . $h->getAttributes()['start_date'] . "\n";
echo "Carbon: " . $h->start_date . "\n";
echo "JSON: " . json_encode($h) . "\n";
