import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';

interface NotificationData {
    id: string;
    data: {
        message: string;
        url: string;
        type: string;
    };
    created_at: string;
    read_at: string | null;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isPushEnabled, setIsPushEnabled] = useState(false);

    useEffect(() => {
        fetchNotifications();
        
        // Polling every 60 seconds (optional)
        const interval = setInterval(fetchNotifications, 60000);
        
        // Check initial push status
        if ('Notification' in window && Notification.permission === 'granted') {
            setIsPushEnabled(true);
        }

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications/unread');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent dropdown from closing
        e.stopPropagation();
        try {
            await axios.post(`/api/notifications/${id}/read`);
            // Update local state
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.post('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                toast.error('Notification permission denied.');
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const vapidPublicKey = document.querySelector('meta[name="vapid-public-key"]')?.getAttribute('content');
            if (!vapidPublicKey) return;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            const key = subscription.getKey('p256dh');
            const token = subscription.getKey('auth');

            await axios.post('/api/push-subscribe', {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: key ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(key)))) : '',
                    auth: token ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(token)))) : ''
                }
            });

            setIsPushEnabled(true);
            toast.success('Push notifications enabled!');
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80" onClick={markAllAsRead}>
                                Mark read
                            </Button>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator className="m-0" />
                
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            You're all caught up!
                        </div>
                    ) : (
                        <div className="flex flex-col pb-2">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={`relative flex flex-col gap-1 px-4 py-3 border-b border-border/50 transition-colors hover:bg-muted/50 ${!notification.read_at ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex justify-between gap-4">
                                        <p className="text-sm text-foreground/90 leading-tight">
                                            {notification.data.message}
                                        </p>
                                        {!notification.read_at && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-5 w-5 shrink-0 rounded-full hover:bg-primary/20 hover:text-primary" 
                                                onClick={(e) => markAsRead(notification.id, e)}
                                            >
                                                <Check className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {new Date(notification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {!isPushEnabled && (
                    <div className="p-2 bg-muted/20 border-t border-border flex justify-center">
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={subscribeToPush}>
                            Enable Push Notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
