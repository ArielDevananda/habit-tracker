<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    /**
     * Update user's push subscription.
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'endpoint' => 'required|string',
            'keys.auth' => 'required|string',
            'keys.p256dh' => 'required|string',
        ]);

        /** @var string $endpoint */
        $endpoint = $request->endpoint;

        /** @var array{auth: string, p256dh: string} $keys */
        $keys = $request->keys;

        $token = $keys['auth'];
        $key = $keys['p256dh'];

        $user = $request->user();
        $user->updatePushSubscription($endpoint, $key, $token);

        return response()->json(['success' => true]);
    }

    /**
     * Delete user's push subscriptions.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->pushSubscriptions()->delete();

        return response()->json(['success' => true]);
    }
}
