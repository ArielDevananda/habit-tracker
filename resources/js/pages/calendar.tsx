import { Head, router } from '@inertiajs/react';
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Calendar', href: '/calendar' },
];

export default function Calendar({ habits, currentYear, currentMonth }: any) {
    const currentViewDate = new Date(currentYear, currentMonth - 1, 1);
    const daysInMonth = getDaysInMonth(currentViewDate);
    const startDayOfWeek = getDay(startOfMonth(currentViewDate)); // 0 = Sunday
    
    const prevMonth = () => {
        const prev = subMonths(currentViewDate, 1);
        router.get(`/calendar`, { year: prev.getFullYear(), month: prev.getMonth() + 1 }, { preserveState: true });
    };
    
    const nextMonth = () => {
        const next = addMonths(currentViewDate, 1);
        router.get(`/calendar`, { year: next.getFullYear(), month: next.getMonth() + 1 }, { preserveState: true });
    };

    const days = [];

    // Padding for first row
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentYear, currentMonth - 1, i));
    }

    const todayStr = new Date().toLocaleDateString('en-CA');

    return (
        <>
            <Head title="Calendar" />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 max-w-7xl w-full mx-auto py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
                        <p className="text-base text-muted-foreground mt-1">
                            Your habit history at a glance.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={prevMonth} className="p-2 bg-card border border-border rounded-full hover:bg-muted transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-semibold w-40 text-center">
                            {format(currentViewDate, 'MMMM yyyy')}
                        </h3>
                        <button onClick={nextMonth} className="p-2 bg-card border border-border rounded-full hover:bg-muted transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="py-3 text-center font-semibold text-sm text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-[120px]">
                        {days.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="border-r border-b border-border/50 bg-muted/10"></div>;
                            }
                            
                            const dateStr = date.toLocaleDateString('en-CA');
                            const isToday = dateStr === todayStr;
                            
                            const scheduledHabits = habits.filter((h: any) => {
                                const habitStart = new Date(h.start_date.split('T')[0]);

                                if (date < habitStart) {
return false;
}
                                
                                if (h.frequency === 'daily') {
return true;
}

                                if (h.frequency === 'weekly' && Array.isArray(h.days_of_week)) {
                                    return h.days_of_week.includes(date.getDay());
                                }

                                return false;
                            });
                            
                            return (
                                <div key={dateStr} className={`border-r border-b border-border/50 p-2 relative transition-colors hover:bg-muted/30 ${isToday ? 'bg-primary/5' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                            {date.getDate()}
                                        </span>
                                        {scheduledHabits.length > 0 && (
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {scheduledHabits.filter((h: any) => {
                                                    const comp = h.completions.find((c: any) => c.completed_on.split('T')[0] === dateStr);

                                                    if (!comp) {
return false;
}

                                                    if (['binary', 'avoid'].includes(h.type)) {
return true;
}

                                                    return parseFloat(comp.value) >= (parseFloat(h.target_value) || 1);
                                                }).length}/{scheduledHabits.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-2 flex flex-col gap-1 overflow-y-auto max-h-[70px] hide-scrollbar">
                                        {scheduledHabits.map((h: any) => {
                                            const comp = h.completions.find((c: any) => c.completed_on.split('T')[0] === dateStr);
                                            let isSuccess = false;

                                            if (comp) {
                                                if (['binary', 'avoid'].includes(h.type)) {
                                                    isSuccess = true;
                                                } else {
                                                    isSuccess = parseFloat(comp.value) >= (parseFloat(h.target_value) || 1);
                                                }
                                            }
                                            
                                            const isFuture = dateStr > todayStr;

                                            if (isFuture) {
                                                return (
                                                    <div key={h.id} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-transparent">
                                                        {h.name}
                                                    </div>
                                                );
                                            }
                                            
                                            return (
                                                <div key={h.id} className={`text-[10px] truncate px-1.5 py-0.5 rounded border ${isSuccess ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                                    {h.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

Calendar.layout = {
    breadcrumbs,
};
