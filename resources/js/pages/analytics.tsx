import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Flame, Award, Activity } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

export default function Analytics() {
    const { habits = [] } = usePage<SharedData & { habits?: any[] }>().props;

    let score = 0, streak = 0, last7DaysScores: any[] = [], heatmapData: any[] = [], categoryScores: any[] = [];
    let errorMessage = null;
    let errorStack = null;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Helper to check if a habit is required on a specific Date
        const isHabitRequiredOnDate = (habit: any, date: Date) => {
            if (habit.start_date) {
                const startDate = new Date(habit.start_date);
                startDate.setHours(0, 0, 0, 0);
                if (date < startDate) return false;
            }

            if (habit.frequency === 'daily') return true;
            if (habit.frequency === 'weekly' && habit.days_of_week) {
                // PHP/JS day of week mapping: JS 0 is Sunday, PHP 0 is Sunday.
                return Array.isArray(habit.days_of_week) ? habit.days_of_week.includes(date.getDay().toString()) : habit.days_of_week.includes(date.getDay().toString());
            }
            return false;
        };

        const getHabitCompletion = (habit: any, dateStr: string) => {
            return habit.completions?.find((c: any) => c.completed_on?.split('T')[0] === dateStr);
        };

        // 1. Calculate Score over last 30 days
        let totalRequired30 = 0;
        let totalCompleted30 = 0;
        const past30Dates: Date[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            past30Dates.push(d);
        }

        past30Dates.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            habits.forEach(habit => {
                if (isHabitRequiredOnDate(habit, date)) {
                    totalRequired30++;
                    if (getHabitCompletion(habit, dateStr)) {
                        totalCompleted30++;
                    }
                }
            });
        });

        score = totalRequired30 > 0 ? Math.round((totalCompleted30 / totalRequired30) * 100) : 0;

        // 2. Calculate Streak (days in a row ALL required habits were met, up to today)
        let currentStreak = 0;
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            let reqCount = 0;
            let compCount = 0;
            habits.forEach(habit => {
                if (isHabitRequiredOnDate(habit, d)) {
                    reqCount++;
                    if (getHabitCompletion(habit, dateStr)) {
                        compCount++;
                    }
                }
            });

            if (reqCount > 0 && compCount === reqCount) {
                currentStreak++;
            } else if (reqCount > 0 && compCount < reqCount) {
                // If today is missed, maybe they just haven't done it yet. But if yesterday missed, streak broken.
                if (i > 0) break; 
            }
        }
        streak = currentStreak;

        // 3. Completion Over Time (Last 7 Days)
        last7DaysScores = past30Dates.slice(-7).map(date => {
            const dateStr = date.toISOString().split('T')[0];
            let req = 0;
            let comp = 0;
            habits.forEach(habit => {
                if (isHabitRequiredOnDate(habit, date)) {
                    req++;
                    if (getHabitCompletion(habit, dateStr)) {
                        comp++;
                    }
                }
            });
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                score: req > 0 ? Math.round((comp / req) * 100) : 0
            };
        });

        // 4. Heatmap (Last 21 Days)
        heatmapData = past30Dates.slice(-21).map(date => {
            const dateStr = date.toISOString().split('T')[0];
            let req = 0;
            let comp = 0;
            habits.forEach(habit => {
                if (isHabitRequiredOnDate(habit, date)) {
                    req++;
                    if (getHabitCompletion(habit, dateStr)) {
                        comp++;
                    }
                }
            });
            return req > 0 ? Math.round((comp / req) * 100) : 0;
        });

        // 5. Category Breakdown (Last 30 Days)
        const categoryMap: Record<string, { req: number, comp: number }> = {};
        habits.forEach(habit => {
            const cat = habit.category || 'Uncategorized';
            if (!categoryMap[cat]) categoryMap[cat] = { req: 0, comp: 0 };
            
            past30Dates.forEach(date => {
                if (isHabitRequiredOnDate(habit, date)) {
                    categoryMap[cat].req++;
                    const dateStr = date.toISOString().split('T')[0];
                    if (getHabitCompletion(habit, dateStr)) {
                        categoryMap[cat].comp++;
                    }
                }
            });
        });

        categoryScores = Object.entries(categoryMap).map(([name, data]) => ({
            name,
            score: data.req > 0 ? Math.round((data.comp / data.req) * 100) : 0
        })).sort((a, b) => b.score - a.score);

    } catch (e: any) {
        errorMessage = e.message;
        errorStack = e.stack;
    }

    if (errorMessage) {
        return (
            <div className="p-8 max-w-3xl mx-auto mt-10 bg-red-950/30 border border-red-500 rounded-xl text-red-500">
                <h2 className="text-xl font-bold mb-4">React Render Error</h2>
                <p className="font-mono text-sm mb-4">{errorMessage}</p>
                <pre className="font-mono text-xs overflow-auto p-4 bg-black/50 rounded">{errorStack}</pre>
            </div>
        );
    }

    const circumference = 2 * Math.PI * 40; // r=40
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const colors = ['bg-primary', 'bg-blue-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500'];

    return (
        <>
            <Head title="Analytics" />
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hero Stat / Overview */}
                    <div className="lg:col-span-2 bg-card/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1">Consistency Score</h2>
                                <div className="text-5xl font-bold text-foreground flex items-baseline gap-2">
                                    {score}<span className="text-2xl font-normal text-muted-foreground">%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Based on your activity over the last 30 days. Keep the momentum going!</p>
                            </div>
                            
                            {/* Simple Progress Ring Visualization */}
                            <div className="relative w-32 h-32 shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" className="text-muted" strokeLinecap="round" strokeWidth="8"></circle>
                                    <circle 
                                        className="transition-all duration-1000 ease-out text-primary" 
                                        cx="50" cy="50" fill="transparent" r="40" 
                                        stroke="currentColor" 
                                        strokeDasharray={circumference} 
                                        strokeDashoffset={strokeDashoffset} 
                                        strokeLinecap="round" strokeWidth="8"
                                    ></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Flame className={`w-8 h-8 ${streak > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-xs font-bold text-muted-foreground mt-1">{streak} Days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Wins */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Wins</h3>
                        <div className="space-y-4">
                            {score >= 80 ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground">High Achiever</h4>
                                        <p className="text-xs text-muted-foreground">&gt;80% consistency this month</p>
                                    </div>
                                </div>
                            ) : null}
                            
                            {streak >= 7 ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground">Perfect Week</h4>
                                        <p className="text-xs text-muted-foreground">7+ day streak active</p>
                                    </div>
                                </div>
                            ) : null}

                            {score < 80 && streak < 7 ? (
                                <p className="text-sm text-muted-foreground">Keep checking in daily to unlock achievements!</p>
                            ) : null}
                        </div>
                    </div>

                    {/* Habit Completion Line Chart */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Completion Over Time</h3>
                            <select className="bg-muted border-none text-sm font-medium text-foreground rounded-lg focus:ring-2 focus:ring-primary" disabled>
                                <option>Last 7 Days</option>
                            </select>
                        </div>

                        {/* Chart Visualization */}
                        <div className="flex-1 relative min-h-[200px] w-full flex items-end justify-between pt-8 pb-4 pr-2 pl-12 border-b border-l border-border">
                            {/* Y-Axis Labels */}
                            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-4 z-10">
                                <span>100</span>
                                <span>50</span>
                                <span>0</span>
                            </div>

                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                                <div className="w-full h-px bg-border opacity-50"></div>
                                <div className="w-full h-px bg-border opacity-50"></div>
                                <div className="w-full h-px bg-border opacity-50"></div>
                            </div>

                            {/* Data Points */}
                            <div className="relative w-full h-full flex items-end justify-between px-4 z-10">
                                {last7DaysScores.map((data, i) => (
                                    <div key={i} className={`w-3 rounded-t-full relative group transition-colors ${data.score >= 90 ? 'bg-primary shadow-[0_0_10px_var(--color-primary)]' : (data.score > 0 ? 'bg-primary/50 hover:bg-primary' : 'bg-muted')}`} style={{ height: `${Math.max(data.score, 5)}%` }}>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                                            {data.score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-6">
                            {last7DaysScores.map((data, i) => (
                                <span key={i}>{data.day}</span>
                            ))}
                        </div>
                    </div>

                    {/* Consistency Heatmap */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Consistency Heatmap</h3>
                        <div className="grid grid-cols-7 gap-2">
                            {heatmapData.map((val, i) => (
                                <div key={i} className={`w-full aspect-square rounded-sm ${val === 0 ? 'bg-muted' : 'bg-primary'}`} style={{ opacity: val === 0 ? 1 : Math.max(0.2, val / 100) }}></div>
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-sm bg-muted"></div>
                                <div className="w-3 h-3 rounded-sm bg-primary opacity-40"></div>
                                <div className="w-3 h-3 rounded-sm bg-primary opacity-80"></div>
                                <div className="w-3 h-3 rounded-sm bg-primary opacity-100"></div>
                            </div>
                            <span>More</span>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown (30 Days)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categoryScores.length > 0 ? categoryScores.map((cat, i) => {
                                const colorClass = colors[i % colors.length];
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span className="text-foreground flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${colorClass} inline-block`}></span> {cat.name}
                                            </span>
                                            <span className="text-muted-foreground">{cat.score}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${cat.score}%` }}></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="col-span-3 text-sm text-muted-foreground text-center py-4">No data available yet.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Analytics.layout = {
    breadcrumbs,
};
