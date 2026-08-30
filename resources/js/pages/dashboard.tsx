import { Head, usePage, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Flame, MoreHorizontal, CheckCircle2, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateHabitModal } from '@/components/create-habit-modal';
import type { Auth } from '@/types/auth';

type HabitCompletion = {
    id: number;
    habit_id: number;
    completed_on: string;
    value: string;
    note: string | null;
};

type Habit = {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    target_value: string;
    unit: string | null;
    frequency: string;
    days_of_week: string[] | null;
    is_active: boolean;
    start_date: string;
    completions: HabitCompletion[];
};

export default function Dashboard({ habits = [] }: { habits?: Habit[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    
    // Menghitung tanggal hari ini dengan format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Fungsi bantuan untuk mengecek apakah habit sudah diselesaikan hari ini
    const isCompletedToday = (habit: Habit) => {
        return habit.completions.some(c => c.completed_on.startsWith(today));
    };

    const completedCount = habits.filter(isCompletedToday).length;
    const totalCount = habits.length;
    const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    
    // Perhitungan untuk lingkaran SVG
    const strokeDasharray = 251.2;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercentage) / 100;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 max-w-7xl w-full mx-auto py-6">
                <div className="mb-8 md:hidden">
                    <h2 className="text-2xl font-bold text-foreground">Good Morning, {auth.user.name}</h2>
                    <p className="text-base text-muted-foreground mt-1">Ready to build some momentum today?</p>
                </div>
                <div className="mb-8 hidden md:block">
                    <h2 className="text-2xl font-bold text-foreground">Good Morning, {auth.user.name}</h2>
                    <p className="text-lg text-muted-foreground mt-1">Ready to build some momentum today?</p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    
                    {/* Daily Habits Column */}
                    <div className="md:col-span-8 flex flex-col space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-foreground">Today's Focus</h3>
                            <div className="flex items-center space-x-4">
                                <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{completedCount} of {totalCount} completed</span>
                                {habits.length > 0 && <CreateHabitModal />}
                            </div>
                        </div>
                        
                        {habits.length === 0 ? (
                            <div className="bg-card rounded-xl p-8 border border-border border-dashed flex flex-col items-center justify-center text-center">
                                <p className="text-muted-foreground mb-4">You haven't set up any habits yet.</p>
                                <CreateHabitModal />
                            </div>
                        ) : (
                            habits.map((habit) => {
                                const completed = isCompletedToday(habit);
                                return (
                                    <div key={habit.id} className={`bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border flex items-center justify-between border-l-4 transition-colors ${completed ? 'border-l-primary' : 'border-l-transparent hover:border-l-border'}`}>
                                        <div className="flex items-center space-x-4">
                                            <Checkbox 
                                                checked={completed} 
                                                onCheckedChange={() => router.post(`/habits/${habit.id}/toggle`, {}, { preserveScroll: true })}
                                                className="w-6 h-6 rounded-full" 
                                            />
                                            <div>
                                                <h4 className={`text-lg text-foreground ${completed ? 'line-through opacity-50' : ''}`}>{habit.name}</h4>
                                                <div className="flex space-x-2 mt-1">
                                                    {habit.category && (
                                                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                                                            {habit.category}
                                                        </span>
                                                    )}
                                                    {habit.target_value && (
                                                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                                            {habit.target_value} {habit.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {completed && <Flame className="text-primary w-6 h-6" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                    {/* Right Column (Stats & Weekly) */}
                    <div className="md:col-span-4 flex flex-col space-y-6">
                        
                        {/* Daily Progress Ring Card */}
                        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border flex flex-col items-center justify-center">
                            <h3 className="text-sm font-medium text-muted-foreground self-start mb-4">Daily Goal</h3>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle className="text-muted" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                    <circle className="text-primary transition-all duration-500 ease-in-out" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeLinecap="round" strokeWidth="8" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-bold text-foreground">{progressPercentage}%</span>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground mt-4 text-center">
                                {totalCount === 0 ? "No habits yet." : 
                                 completedCount === totalCount ? "You did it! Awesome work." :
                                 `You're almost there! ${totalCount - completedCount} habits remaining.`}
                            </p>
                        </div>
                        
                        {/* Weekly Streaks Mini Card */}
                        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-foreground">Weekly Overview</h3>
                                <button className="text-muted-foreground hover:text-primary transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex justify-between">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    // Generate the last 7 days ending with today (or start from Monday to Sunday depending on preference)
                                    // Let's do a sliding window of the last 7 days ending today
                                    const d = new Date();
                                    d.setDate(d.getDate() - (6 - i));
                                    const dateString = d.toISOString().split('T')[0];
                                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
                                    const dayOfWeekNum = d.getDay(); // 0 (Sun) to 6 (Sat)
                                    const isToday = i === 6;

                                    // Hitung target habits untuk hari ini
                                    const targetHabits = habits.filter(h => {
                                        if (!h.is_active) return false;
                                        
                                        // Pastikan membandingkan hanya format YYYY-MM-DD
                                        const habitStartDate = h.start_date ? h.start_date.split('T')[0] : '';
                                        if (habitStartDate > dateString) return false; // Belum mulai
                                        
                                        if (h.frequency === 'daily') return true;
                                        if (h.frequency === 'weekly' && h.days_of_week) {
                                            return h.days_of_week.includes(dayOfWeekNum);
                                        }
                                        return false;
                                    });

                                    const dayTotal = targetHabits.length;
                                    const dayCompleted = targetHabits.filter(h => 
                                        h.completions.some(c => c.completed_on.startsWith(dateString))
                                    ).length;

                                    const allDone = dayTotal > 0 && dayCompleted === dayTotal;
                                    const someDone = dayCompleted > 0 && !allDone;
                                    const noneDone = dayCompleted === 0;
                                    const isPast = d < new Date(new Date().setHours(0,0,0,0));

                                    return (
                                        <div key={i} className={`flex flex-col items-center space-y-2 ${(!isToday && !isPast) ? 'opacity-50' : ''}`}>
                                            <span className={`text-xs font-medium ${isToday ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>{dayName}</span>
                                            {allDone ? (
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            ) : isToday ? (
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                                                    <span className="text-xs font-medium">{dayCompleted}/{dayTotal}</span>
                                                </div>
                                            ) : someDone ? (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary/70">
                                                    <span className="text-xs font-medium">{dayCompleted}</span>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                    {dayTotal > 0 && isPast ? '-' : ''}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
