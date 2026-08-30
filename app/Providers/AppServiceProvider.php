<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->extend(\Minishlink\WebPush\WebPush::class, function ($webPush, $app) {
            $client = new \GuzzleHttp\Client(['verify' => false]);
            $webPush->setReuseVAPIDHeaders(true); // Optional optimization
            // For WebPush v11, we need to pass a custom HTTP client
            // Actually, WebPush constructor accepts custom client options, but since it's already instantiated,
            // we can just set a new client if the method exists, or re-instantiate it.
            // In v11, WebPush uses an HTTP factory, but let's just use Guzzle.
            return new \Minishlink\WebPush\WebPush(
                [
                    'VAPID' => [
                        'subject' => config('webpush.vapid.subject'),
                        'publicKey' => config('webpush.vapid.public_key'),
                        'privateKey' => config('webpush.vapid.private_key')
                    ]
                ],
                [],
                new \GuzzleHttp\Client(['verify' => false])
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
