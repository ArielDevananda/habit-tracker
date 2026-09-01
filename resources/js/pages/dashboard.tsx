import { Head, usePage, router } from '@inertiajs/react';
import { startOfWeek, addDays, format, isSameDay, startOfDay } from 'date-fns';
import { Flame, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { CreateHabitModal } from '@/components/create-habit-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { dashboard } from '@/routes';
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
    type: string;
    status: string;
    start_date: string;
    completions: HabitCompletion[];
};

const HabitProgressInput = ({ habit, selectedDate, currentValue }: any) => {
    const [val, setVal] = useState(currentValue.toString());
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVal(currentValue.toString());
    }, [currentValue]);

    const handleUpdate = () => {
        const num = parseFloat(val);

        if (isNaN(num)) {
            setVal(currentValue.toString());

            return;
        }

        if (num !== currentValue) {
            router.post(`/habits/${habit.id}/value`, { 
                date: selectedDate, 
                value: Math.max(0, num) 
            }, { preserveScroll: true });
        }
    };

    return (
        <input 
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur();
                }
            }}
            className="w-12 text-center text-sm font-medium p-0 border-none bg-transparent focus:ring-1 focus:ring-primary rounded hide-arrows"
            style={{ MozAppearance: 'textfield' }}
        />
    );
};

export default function Dashboard({ habits = [] }: { habits?: Habit[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    
    // Menghitung tanggal hari ini dengan format YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState<string>(today);

    const getCompletionValue = (habit: any, date: string) => {
        const completion = habit.completions.find((c: any) => {
            return c.completed_on.split('T')[0] === date;
        });

        return completion ? parseFloat(completion.value || habit.target_value || 1) : 0;
    };

    const isCompletedOnDate = (habit: any, date: string) => {
        if (habit.type === 'binary' || habit.type === 'avoid') {
            return habit.completions.some((c: any) => c.completed_on.split('T')[0] === date);
        }

        return getCompletionValue(habit, date) >= parseFloat(habit.target_value || 1);
    };

    const isCompletedToday = (habit: any) => isCompletedOnDate(habit, selectedDate);

    // Helper to check if a habit should be done on a specific date string (YYYY-MM-DD)
    const isHabitTargetedForDate = (habit: any, dateStr: string) => {
        if (habit.status !== 'active') {
return false;
}
        
        // Ensure habit has started
        const habitStartDate = habit.start_date ? habit.start_date.split('T')[0] : '';

        if (habitStartDate > dateStr) {
return false;
}
        
        if (habit.frequency === 'daily') {
return true;
}
        
        if (habit.frequency === 'weekly' && habit.days_of_week) {
            // Get day of week (0-6) for the target date
            // Note: parsing 'YYYY-MM-DD' directly can cause timezone shifts if not careful.
            // Using new Date(dateStr + 'T00:00:00') ensures local timezone parsing.
            const targetDateObj = new Date(dateStr + 'T00:00:00');
            const dayOfWeekNum = targetDateObj.getDay();
            
            // Check if days_of_week contains this day (needs to handle string or int depending on cast)
            // Sometimes it comes from JSON as strings, sometimes ints.
            return habit.days_of_week.some((d: any) => String(d) === String(dayOfWeekNum));
        }
        
        return false;
    };

    const activeHabitsForSelectedDate = habits.filter(h => isHabitTargetedForDate(h, selectedDate));

    const completedCount = activeHabitsForSelectedDate.filter(isCompletedToday).length;
    const totalCount = activeHabitsForSelectedDate.length;
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
                            <div>
                                <h3 className="text-xl font-bold text-foreground">
                                    {selectedDate === today ? "Today's Focus" : `Focus for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
                                </h3>
                                {selectedDate !== today && (
                                    <button 
                                        onClick={() => setSelectedDate(today)}
                                        className="text-xs text-primary hover:underline mt-1"
                                    >
                                        ← Back to Today
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{completedCount} of {totalCount} completed</span>
                                {habits.length > 0 && <CreateHabitModal />}
                            </div>
                        </div>
                        
                        {activeHabitsForSelectedDate.length === 0 ? (
                            <div className="bg-card rounded-xl p-8 border border-border border-dashed flex flex-col items-center justify-center text-center">
                                <p className="text-muted-foreground mb-4">No habits scheduled for this day.</p>
                                <CreateHabitModal />
                            </div>
                        ) : (
                            activeHabitsForSelectedDate.map((habit) => {
                                const completed = isCompletedToday(habit);

                                return (
                                    <div key={habit.id} className={`bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border flex items-center justify-between border-l-4 transition-colors ${completed ? 'border-l-primary' : 'border-l-transparent hover:border-l-border'}`}>
                                        <div className="flex items-center space-x-4">
                                            {['binary', 'avoid'].includes(habit.type) ? (
                                                <Checkbox 
                                                    checked={completed} 
                                                    onCheckedChange={() => router.post(`/habits/${habit.id}/toggle`, { date: selectedDate }, { preserveScroll: true })}
                                                    className="w-6 h-6 rounded-full shrink-0" 
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center shrink-0 w-20">
                                                    <div className="flex items-center space-x-1 mb-1">
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                const step = Math.max(1, Math.ceil((parseFloat(habit.target_value) || 1) / 10));
                                                                router.post(`/habits/${habit.id}/value`, { date: selectedDate, value: Math.max(0, getCompletionValue(habit, selectedDate) - step) }, { preserveScroll: true })
                                                            }}
                                                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors leading-none"
                                                        >-</button>
                                                        <HabitProgressInput 
                                                            habit={habit} 
                                                            selectedDate={selectedDate} 
                                                            currentValue={getCompletionValue(habit, selectedDate)} 
                                                        />
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                const step = Math.max(1, Math.ceil((parseFloat(habit.target_value) || 1) / 10));
                                                                router.post(`/habits/${habit.id}/value`, { date: selectedDate, value: getCompletionValue(habit, selectedDate) + step }, { preserveScroll: true })
                                                            }}
                                                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors leading-none"
                                                        >+</button>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-primary transition-all duration-300"
                                                            style={{ width: `${Math.min(100, (getCompletionValue(habit, selectedDate) / (parseFloat(habit.target_value) || 1)) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className={`text-lg text-foreground ${completed ? 'line-through opacity-50' : ''}`}>{habit.name}</h4>
                                                <div className="flex space-x-2 mt-1">
                                                    {habit.category && (
                                                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                                                            {habit.category === 'Health' ? '🍏 ' :
                                                             habit.category === 'Mind' ? '🧠 ' :
                                                             habit.category === 'Productivity' ? '🚀 ' :
                                                             habit.category === 'Finance' ? '💰 ' :
                                                             habit.category === 'Fitness' ? '🏃 ' :
                                                             habit.category === 'Social' ? '🤝 ' :
                                                             '📌 '}
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
                            </div>
                            <div className="flex justify-between">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    // Generate the current week (Monday to Sunday)
                                    const now = new Date();
                                    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // 1 = Monday
                                    const d = addDays(startOfCurrentWeek, i);
                                    
                                    const dateString = format(d, 'yyyy-MM-dd'); // Same as 'en-CA'
                                    const dayNameShort = format(d, 'E').charAt(0);
                                    
                                    const isToday = isSameDay(d, now);

                                    // Hitung target habits untuk hari ini
                                    const targetHabits = habits.filter(h => isHabitTargetedForDate(h, dateString));

                                    const dayTotal = targetHabits.length;
                                    const dayCompleted = targetHabits.filter(h => 
                                        h.completions.some((c: any) => {
                                            return c.completed_on.split('T')[0] === dateString;
                                        })
                                    ).length;

                                    const allDone = dayTotal > 0 && dayCompleted === dayTotal;
                                    const someDone = dayCompleted > 0 && !allDone;
                                    const isFuture = startOfDay(d) > startOfDay(now);

                                    const isSelected = selectedDate === dateString;

                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedDate(dateString)}
                                            className={`flex flex-col items-center space-y-2 focus:outline-none transition-transform hover:scale-110 active:scale-95 ${isFuture ? 'opacity-50' : 'cursor-pointer'}`}
                                        >
                                            <span className={`text-xs font-medium ${isToday ? 'text-foreground font-bold' : 'text-muted-foreground'} ${isSelected ? 'text-primary' : ''}`}>{dayNameShort}</span>
                                            {allDone ? (
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            ) : someDone ? (
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                                    <span className="text-xs font-bold">{dayCompleted}</span>
                                                </div>
                                            ) : (
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
                                                    <span className="text-xs text-muted-foreground">{format(d, 'd')}</span>
                                                </div>
                                            )}
                                        </button>
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
