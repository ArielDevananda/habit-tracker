<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$h = App\Models\Habit::find(16);
$h->mergeCasts(['start_date' => 'date:Y-m-d']);
echo "JSON with date:Y-m-d -> " . json_encode($h) . "\n";
