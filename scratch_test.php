<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$req = new App\Http\Requests\UpdateHabitRequest();
$req->merge([
    'name' => 'test',
    'type' => 'quantity',
    'frequency' => 'daily',
    'status' => 'active',
    'target_value' => null,
    'start_date' => '2026-09-01'
]);
$validator = validator($req->all(), $req->rules());
print_r($validator->errors()->toArray());
