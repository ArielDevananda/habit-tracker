import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Target } from 'lucide-react';

export default function GoalShow({ goal }: { goal: any }) {
    // Basic calculation for MVP: Progress is just a placeholder until we define a formula.
    // For instance, if a goal has a start_date and deadline, we can show "Days Remaining".
    const daysRemaining = goal.deadline
        ? Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) /
                  (1000 * 3600 * 24),
          )
        : null;

    return (
        <>
            <Head title={goal.name} />

            <div className="flex flex-col gap-8 p-4 pt-12 sm:p-8 sm:pt-16">
                <div className="flex items-center gap-4">
                    <Link
                        href="/goals"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground transition-colors hover:bg-secondary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {goal.name}
                        </h1>
                        {goal.category && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {goal.category}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-1 flex flex-col gap-6">
                        {/* Goal Details */}
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">
                                Goal Details
                            </h3>
                            <dl className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Start Date
                                    </dt>
                                    <dd className="font-medium">
                                        {new Date(
                                            goal.start_date,
                                        ).toLocaleDateString()}
                                    </dd>
                                </div>
                                {goal.deadline && (
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Deadline
                                        </dt>
                                        <dd className="font-medium">
                                            {new Date(
                                                goal.deadline,
                                            ).toLocaleDateString()}
                                        </dd>
                                    </div>
                                )}
                                {daysRemaining !== null && (
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Days Remaining
                                        </dt>
                                        <dd
                                            className={`font-medium ${daysRemaining < 0 ? 'text-destructive' : 'text-green-600'}`}
                                        >
                                            {daysRemaining < 0
                                                ? 'Overdue'
                                                : `${daysRemaining} days`}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
                        {/* Linked Habits */}
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">
                                Linked Habits
                            </h3>
                            {goal.habits && goal.habits.length > 0 ? (
                                <ul className="flex flex-col gap-3">
                                    {goal.habits.map((habit: any) => (
                                        <li
                                            key={habit.id}
                                            className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Target className="h-5 w-5 text-primary" />
                                                <span className="font-medium">
                                                    {habit.name}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/habits/${habit.id}`}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                View Habit &rarr;
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No habits linked to this goal yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

GoalShow.layout = {
    breadcrumbs: [
        {
            title: 'Goals',
            href: '/goals',
        },
        {
            title: 'Goal Details',
            href: '#',
        },
    ],
};
