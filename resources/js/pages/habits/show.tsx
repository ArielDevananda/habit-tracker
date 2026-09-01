import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Flame,
    Calendar,
    Target,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

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
    total_completions: number;
};

const categoryEmojis: Record<string, string> = {
    Health: '🍏',
    Mind: '🧠',
    Productivity: '🚀',
    Finance: '💰',
    Fitness: '🏃',
    Social: '🤝',
    General: '📌',
};

export default function HabitShow({ habit }: { habit: Habit }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build 30-day chart data
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toLocaleDateString('en-CA');
        const completed = habit.completions.some((c) => {
            const cDate = new Date(c.completed_on).toLocaleDateString('en-CA');

            return cDate === dateStr;
        });

        return {
            date: d,
            dateStr,
            day: d.getDate(),
            weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
            completed,
        };
    });

    // Calculate current streak
    let streak = 0;

    for (let i = last30Days.length - 1; i >= 0; i--) {
        if (last30Days[i].completed) {
            streak++;
        } else {
            // If today and not completed, don't break (user might not have done it yet)
            if (i === last30Days.length - 1) {
                continue;
            }

            break;
        }
    }

    // Best streak in last 30 days
    let bestStreak = 0;
    let currentRun = 0;

    for (const day of last30Days) {
        if (day.completed) {
            currentRun++;

            if (currentRun > bestStreak) {
                bestStreak = currentRun;
            }
        } else {
            currentRun = 0;
        }
    }

    // Completion rate (last 30 days)
    const completedDays = last30Days.filter((d) => d.completed).length;
    const completionRate = Math.round((completedDays / 30) * 100);

    // Recent completions list (last 10)
    const recentCompletions = [...habit.completions]
        .sort(
            (a, b) =>
                new Date(b.completed_on).getTime() -
                new Date(a.completed_on).getTime(),
        )
        .slice(0, 10);

    const emoji = categoryEmojis[habit.category || 'General'] || '📌';

    return (
        <>
            <Head title={habit.name} />
            <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-6 md:px-8">
                {/* Back Button */}
                <Link
                    href="/habits"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Habits
                </Link>

                {/* Header */}
                <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl">
                            {emoji}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {habit.name}
                            </h1>
                            {habit.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {habit.description}
                                </p>
                            )}
                            <div className="mt-2 flex gap-2">
                                {habit.category && (
                                    <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600">
                                        {habit.category}
                                    </span>
                                )}
                                <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">
                                    {habit.frequency}
                                    {habit.target_value
                                        ? ` • ${habit.target_value} ${habit.unit || ''}`
                                        : ''}
                                </span>
                                {habit.status !== 'active' && (
                                    <span className="flex items-center gap-1 rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600 capitalize">
                                        {habit.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                        <Flame className="mx-auto mb-2 h-5 w-5 text-primary" />
                        <p className="text-2xl font-bold text-foreground">
                            {streak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Current Streak
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                        <TrendingUp className="mx-auto mb-2 h-5 w-5 text-emerald-500" />
                        <p className="text-2xl font-bold text-foreground">
                            {bestStreak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Best Streak
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                        <Target className="mx-auto mb-2 h-5 w-5 text-blue-500" />
                        <p className="text-2xl font-bold text-foreground">
                            {completionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Last 30 Days
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                        <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                        <p className="text-2xl font-bold text-foreground">
                            {habit.total_completions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total Check-ins
                        </p>
                    </div>
                </div>

                {/* 30-Day Chart */}
                <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Calendar className="h-5 w-5" />
                        Last 30 Days
                    </h3>
                    <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-15 md:grid-cols-30">
                        {last30Days.map((day, i) => (
                            <div
                                key={i}
                                className="group relative flex flex-col items-center"
                            >
                                <div
                                    className={`aspect-square w-full rounded-md transition-colors ${
                                        day.completed
                                            ? 'bg-primary shadow-sm'
                                            : 'bg-muted'
                                    }`}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-1 text-[10px] whitespace-nowrap text-background group-hover:block">
                                    {day.dateStr} {day.completed ? '✅' : '❌'}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{last30Days[0].dateStr}</span>
                        <div className="flex items-center gap-2">
                            <span>Miss</span>
                            <div className="h-3 w-3 rounded-sm bg-muted"></div>
                            <div className="h-3 w-3 rounded-sm bg-primary"></div>
                            <span>Done</span>
                        </div>
                        <span>{last30Days[last30Days.length - 1].dateStr}</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                        Recent Activity
                    </h3>
                    {recentCompletions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No completions recorded yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentCompletions.map((completion) => {
                                const d = new Date(completion.completed_on);

                                return (
                                    <div
                                        key={completion.id}
                                        className="flex items-center justify-between border-b border-border py-2 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            <span className="text-sm text-foreground">
                                                {d.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        {completion.value && (
                                            <span className="text-sm text-muted-foreground">
                                                {completion.value}{' '}
                                                {habit.unit || ''}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

HabitShow.layout = {
    breadcrumbs: [
        {
            title: 'My Habits',
            href: '/habits',
        },
        {
            title: 'Detail',
            href: '#',
        },
    ] as BreadcrumbItem[],
};
