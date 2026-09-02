<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class HabitReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $message;

    public string $url;

    public string $typeStr;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $message, string $url = '/dashboard', string $typeStr = 'reminder')
    {
        $this->message = $message;
        $this->url = $url;
        $this->typeStr = $typeStr;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', WebPushChannel::class];
    }

    /**
     * Get the web push representation of the notification.
     */
    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('Habit Reminder')
            ->icon('/apple-touch-icon.png')
            ->body($this->message)
            ->action('View Dashboard', $this->url)
            ->data(['url' => $this->url]);
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'type' => $this->typeStr,
        ];
    }
}
