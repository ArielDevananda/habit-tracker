<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\HabitReminderNotification;

class TestPushNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'push:test {message=Halo, ini tes notifikasi manual!}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim uji coba Web Push Notification ke pengguna.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereHas('pushSubscriptions')->get();
        
        if ($users->isEmpty()) {
            $this->error('Tidak ada user yang berlangganan push notification di database!');
            return;
        }

        $message = $this->argument('message');
        
        foreach ($users as $user) {
            $user->notify(new HabitReminderNotification($message));
        }
        
        $this->info("Notifikasi telah dimasukkan ke antrean (Queue) untuk {$users->count()} user.");
        $this->info("Pesan: {$message}");
    }
}
