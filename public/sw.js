const CACHE_NAME = 'habit-tracker-v1';

// Install event - caching static assets (optional, keeping minimal for now)
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network falling back to cache
self.addEventListener('fetch', (event) => {
    // Only handle GET requests for PWA standard compliance
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// Listen for Push events
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = (data) => {
        return self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/apple-touch-icon.png',
            data: data.data || { url: '/' },
            actions: data.actions || []
        });
    };

    if (event.data) {
        let textData = '';
        try {
            textData = event.data.text();
            console.log('Push event received:', textData);
            const message = JSON.parse(textData);
            event.waitUntil(sendNotification(message));
        } catch (e) {
            console.error('Error parsing push data:', e, 'Raw data:', textData);
            event.waitUntil(sendNotification({ title: 'New Notification', body: 'You have a new message!' }));
        }
    }
});

// Listen for notification click
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
