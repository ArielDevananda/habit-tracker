import { Head, Link } from '@inertiajs/react';
import { Target, CalendarDays } from 'lucide-react';
import { CreateGoalModal } from '@/components/create-goal-modal';

export default function GoalsIndex({
    goals,
    habits,
}: {
    goals: any[];
    habits: any[];
}) {
    return (
        <>
            <Head title="Goals" />

            <div className="flex flex-col gap-8 p-4 pt-12 sm:p-8 sm:pt-16">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Goals
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Connect your daily actions to long-term goals.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <CreateGoalModal habits={habits} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {goals.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
                            <Target className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No goals yet
                            </h3>
                            <p className="mb-6 max-w-sm text-muted-foreground">
                                Give your habits a bigger purpose by creating a
                                long-term goal.
                            </p>
                            <CreateGoalModal habits={habits} />
                        </div>
                    ) : (
                        goals.map((goal) => (
                            <Link
                                key={goal.id}
                                href={`/goals/${goal.id}`}
                                className="block"
                            >
                                <article className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl leading-tight font-bold">
                                                    {goal.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {goal.habits?.length || 0}{' '}
                                                    linked habits
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {goal.deadline && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarDays className="h-4 w-4" />
                                            Deadline:{' '}
                                            {new Date(
                                                goal.deadline,
                                            ).toLocaleDateString()}
                                        </div>
                                    )}

                                    {goal.description && (
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {goal.description}
                                        </p>
                                    )}
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

GoalsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Goals',
            href: '/goals',
        },
    ],
};
