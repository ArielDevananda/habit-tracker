import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';

export default function Notifications() {
    const [isPushEnabled, setIsPushEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if push is already enabled
        if ('Notification' in window && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager
                    .getSubscription()
                    .then((subscription) => {
                        setIsPushEnabled(!!subscription);
                    });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    };

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true);

        if (checked) {
            // Enable Push Notifications
            try {
                const permission = await Notification.requestPermission();

                if (permission !== 'granted') {
                    toast.error(
                        'Notification permission denied. Please enable it in your browser settings.',
                    );
                    setIsLoading(false);

                    return;
                }

                const registration = await navigator.serviceWorker.ready;
                const vapidPublicKey = document
                    .querySelector('meta[name="vapid-public-key"]')
                    ?.getAttribute('content');

                if (!vapidPublicKey) {
                    console.error('VAPID key not found');
                    setIsLoading(false);

                    return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
                });

                const key = subscription.getKey('p256dh');
                const token = subscription.getKey('auth');

                await axios.post('/api/push-subscribe', {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: key
                            ? btoa(
                                  String.fromCharCode.apply(
                                      null,
                                      Array.from(new Uint8Array(key)),
                                  ),
                              )
                            : '',
                        auth: token
                            ? btoa(
                                  String.fromCharCode.apply(
                                      null,
                                      Array.from(new Uint8Array(token)),
                                  ),
                              )
                            : '',
                    },
                });

                setIsPushEnabled(true);
            } catch (error) {
                console.error('Push subscription failed:', error);
                toast.error('Failed to enable notifications.');
            }
        } else {
            // Disable Push Notifications
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription =
                    await registration.pushManager.getSubscription();

                if (subscription) {
                    await subscription.unsubscribe();
                }

                await axios.delete('/api/push-subscribe');
                setIsPushEnabled(false);
            } catch (error) {
                console.error('Unsubscribe failed:', error);
                toast.error('Failed to disable notifications.');
            }
        }

        setIsLoading(false);
    };

    return (
        <>
            <Head title="Notification settings" />

            <h1 className="sr-only">Notification settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Notification settings"
                    description="Manage how you receive alerts and reminders."
                />

                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold">
                            Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Receive daily habit reminders on your desktop or
                            lock screen.
                        </p>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-5 w-5 cursor-pointer rounded border-border bg-background text-primary focus:ring-primary"
                            checked={isPushEnabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [
        {
            title: 'Notification settings',
            href: '/settings/notifications',
        },
    ],
};
