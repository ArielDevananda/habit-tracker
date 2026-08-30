<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(2);
$sub = $user->pushSubscriptions()->first();

$webPush = app(\Minishlink\WebPush\WebPush::class);

$subObj = \Minishlink\WebPush\Subscription::create([
    'endpoint' => $sub->endpoint,
    'publicKey' => $sub->public_key,
    'authToken' => $sub->auth_token,
    'contentEncoding' => $sub->content_encoding
]);

$webPush->queueNotification($subObj, '{"title":"test from debug"}');
foreach($webPush->flush() as $report) {
    var_dump($report->isSuccess());
    var_dump($report->getReason());
}
