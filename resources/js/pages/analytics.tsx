import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from 'recharts';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Analytics', href: '/analytics' },
];

export default function Analytics({ habits }: { habits: any[] }) {
    // 1. Calculate overall completion rate (Active habits only)
    const activeHabits = habits.filter((h) => h.status === 'active');

    // For each habit, what is its success rate in the last 30 days?
    let totalScheduled = 0;
    let totalCompleted = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Daily completion trend data
    const dailyTrendMap: Record<
        string,
        { date: string; scheduled: number; completed: number }
    > = {};

    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        dailyTrendMap[dateStr] = { date: dateStr, scheduled: 0, completed: 0 };
    }

    activeHabits.forEach((habit) => {
        const habitStart = new Date(habit.start_date.split('T')[0]);

        // Populate daily trend
        Object.keys(dailyTrendMap).forEach((dateStr) => {
            const d = new Date(dateStr);

            if (d >= habitStart) {
                let isScheduled = false;

                if (habit.frequency === 'daily') {
                    isScheduled = true;
                } else if (
                    habit.frequency === 'weekly' &&
                    Array.isArray(habit.days_of_week)
                ) {
                    isScheduled = habit.days_of_week.includes(d.getDay());
                }

                if (isScheduled) {
                    dailyTrendMap[dateStr].scheduled++;
                    totalScheduled++;

                    const comp = habit.completions.find(
                        (c: any) => c.completed_on.split('T')[0] === dateStr,
                    );

                    if (comp) {
                        let success = false;

                        if (['binary', 'avoid'].includes(habit.type)) {
                            success = true;
                        } else {
                            success =
                                parseFloat(comp.value) >=
                                (parseFloat(habit.target_value) || 1);
                        }

                        if (success) {
                            dailyTrendMap[dateStr].completed++;
                            totalCompleted++;
                        }
                    }
                }
            }
        });
    });

    const dailyTrendData = Object.values(dailyTrendMap).map((d) => ({
        ...d,
        rate:
            d.scheduled > 0 ? Math.round((d.completed / d.scheduled) * 100) : 0,
        displayDate: new Date(d.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }));

    const completionRate =
        totalScheduled > 0
            ? Math.round((totalCompleted / totalScheduled) * 100)
            : 0;

    const pieData = [
        { name: 'Completed', value: totalCompleted, color: 'var(--primary)' },
        {
            name: 'Missed',
            value: totalScheduled - totalCompleted,
            color: 'var(--destructive)',
        },
    ];

    // Find top streaks
    const topStreaks = [...habits]
        .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))
        .slice(0, 5);

    return (
        <>
            <Head title="Analytics" />
            <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-4 py-6 md:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">
                        Analytics & Insights
                    </h2>
                    <p className="mt-1 text-base text-muted-foreground">
                        Track your performance over the last 30 days.
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Key Metrics */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                            Overall Completion Rate
                        </h3>
                        <div className="text-5xl font-bold text-primary">
                            {completionRate}%
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {totalCompleted} of {totalScheduled} habits
                            completed
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                            Success Ratio
                        </h3>
                        <div className="h-[120px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                            Top Streaks 🔥
                        </h3>
                        <div className="space-y-3">
                            {topStreaks.length > 0 ? (
                                topStreaks.map((h) => (
                                    <div
                                        key={h.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="w-32 truncate text-sm font-medium">
                                            {h.name}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-muted-foreground">
                                                Best: {h.longest_streak}
                                            </span>
                                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                {h.current_streak} days
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No active streaks.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold">
                            Daily Completion Volume
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dailyTrendData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="var(--border)"
                                    />
                                    <XAxis
                                        dataKey="displayDate"
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                        allowDecimals={false}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '8px',
                                        }}
                                        itemStyle={{
                                            color: 'var(--foreground)',
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="completed"
                                        name="Completed"
                                        fill="var(--primary)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="scheduled"
                                        name="Scheduled"
                                        fill="var(--muted)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold">
                            Daily Success Rate (%)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dailyTrendData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="var(--border)"
                                    />
                                    <XAxis
                                        dataKey="displayDate"
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                        domain={[0, 100]}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        name="Success Rate %"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
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
