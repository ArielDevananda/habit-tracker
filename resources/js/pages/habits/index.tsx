import { Head, Link } from '@inertiajs/react';
import { Flame } from 'lucide-react';
import { useState } from 'react';
import { DeleteHabitModal } from '@/components/delete-habit-modal';
import { EditHabitModal } from '@/components/edit-habit-modal';

export default function HabitsIndex({ habits = [] }: { habits?: any[] }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('active');
    const [sortBy, setSortBy] = useState('streak');

    // Get unique categories from the user's habits (ignoring null/empty)
    const availableCategories = Array.from(
        new Set(habits.map((h) => h.category).filter(Boolean)),
    );

    // Filter habits based on selected category and status
    const filteredHabits = habits.filter((h) => {
        const matchesCategory =
            activeFilter === 'All' || h.category === activeFilter;
        const matchesStatus = h.status === statusFilter;

        return matchesCategory && matchesStatus;
    });

    // Sort habits based on selected sort option
    const sortedHabits = [...filteredHabits].sort((a, b) => {
        if (sortBy === 'streak') {
            return (b.completions_count || 0) - (a.completions_count || 0);
        }

        if (sortBy === 'name') {
            return (a.name || '').localeCompare(b.name || '');
        }

        if (sortBy === 'recent') {
            return (
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
            );
        }

        return 0;
    });

    return (
        <>
            <Head title="My Habits" />
            <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-4 py-6 md:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">
                        My Habits
                    </h2>
                    <p className="mt-1 text-base text-muted-foreground">
                        Manage all your tracked habits
                    </p>
                </div>

                {/* Toolbar */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="hide-scrollbar flex w-full snap-x gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
                        <button
                            onClick={() => setActiveFilter('All')}
                            className={`shrink-0 snap-start rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all active:scale-95 ${activeFilter === 'All' ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-muted'}`}
                        >
                            All Categories
                        </button>
                        {availableCategories.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`shrink-0 snap-start rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all active:scale-95 ${activeFilter === cat ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-muted'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Status:
                            </span>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="cursor-pointer border-none bg-transparent py-1 pr-6 pl-1 text-base font-medium text-primary focus:ring-0"
                            >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Sort by:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="cursor-pointer border-none bg-transparent py-1 pr-6 pl-1 text-base font-medium text-primary focus:ring-0"
                            >
                                <option value="streak">
                                    Completions (High to Low)
                                </option>
                                <option value="name">Name (A-Z)</option>
                                <option value="recent">Recent</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bento Grid / Cards List */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {sortedHabits.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
                            <p className="mb-4 text-muted-foreground">
                                No habits found.
                            </p>
                        </div>
                    ) : (
                        sortedHabits.map((habit: any) => (
                            <Link
                                key={habit.id}
                                href={`/habits/${habit.id}`}
                                className="block"
                            >
                                <article className="group relative flex cursor-pointer flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row">
                                    <div
                                        className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity sm:group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <EditHabitModal habit={habit} />
                                        <DeleteHabitModal habit={habit} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                {habit.category === 'Health' ? (
                                                    <span className="text-xl">
                                                        🍏
                                                    </span>
                                                ) : habit.category ===
                                                  'Mind' ? (
                                                    <span className="text-xl">
                                                        🧠
                                                    </span>
                                                ) : habit.category ===
                                                  'Productivity' ? (
                                                    <span className="text-xl">
                                                        🚀
                                                    </span>
                                                ) : habit.category ===
                                                  'Finance' ? (
                                                    <span className="text-xl">
                                                        💰
                                                    </span>
                                                ) : habit.category ===
                                                  'Fitness' ? (
                                                    <span className="text-xl">
                                                        🏃
                                                    </span>
                                                ) : habit.category ===
                                                  'Social' ? (
                                                    <span className="text-xl">
                                                        🤝
                                                    </span>
                                                ) : (
                                                    <span className="text-xl">
                                                        📌
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl leading-tight font-bold text-foreground">
                                                    {habit.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-muted-foreground capitalize">
                                                    {habit.frequency}{' '}
                                                    {habit.target_value
                                                        ? `• ${habit.target_value} ${habit.unit}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            {habit.category && (
                                                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600">
                                                    {habit.category}
                                                </span>
                                            )}
                                            {habit.status !== 'active' && (
                                                <span className="rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600 capitalize">
                                                    {habit.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex min-w-[120px] flex-col items-start justify-center border-border sm:items-end sm:border-l sm:pl-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl leading-none font-bold text-primary">
                                                {habit.completions_count || 0}
                                            </span>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                total
                                            </span>
                                        </div>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                                            <Flame className="h-3 w-3" />{' '}
                                            Completions
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

HabitsIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Habits',
            href: '/habits',
        },
    ],
};
