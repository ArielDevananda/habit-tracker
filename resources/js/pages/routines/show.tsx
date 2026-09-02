import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function RoutineShow({ routine }: { routine: any }) {
    return (
        <>
            <Head title={routine.name} />

            <div className="flex flex-col gap-8 p-4 pt-12 sm:p-8 sm:pt-16">
                <div className="flex items-center gap-4">
                    <Link
                        href="/routines"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground transition-colors hover:bg-secondary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {routine.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground capitalize">
                            {routine.status} Routine
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
                        {/* Routine Habits */}
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">
                                Routine Habits
                            </h3>
                            {routine.habits && routine.habits.length > 0 ? (
                                <ul className="flex flex-col gap-3">
                                    {routine.habits.map(
                                        (habit: any, index: number) => (
                                            <li
                                                key={habit.id}
                                                className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            {habit.name}
                                                        </span>
                                                        <p className="text-xs text-muted-foreground">
                                                            {habit.frequency}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/habits/${habit.id}`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    View &rarr;
                                                </Link>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No habits in this routine yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col gap-6">
                        {/* Routine Description */}
                        {routine.description && (
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Description
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {routine.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

RoutineShow.layout = {
    breadcrumbs: [
        {
            title: 'Routines',
            href: '/routines',
        },
        {
            title: 'Routine Details',
            href: '#',
        },
    ],
};
