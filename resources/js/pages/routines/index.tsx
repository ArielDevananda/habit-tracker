import { Head, Link } from '@inertiajs/react';
import { Repeat } from 'lucide-react';
import { CreateRoutineModal } from '@/components/create-routine-modal';

export default function RoutinesIndex({
    routines,
    habits,
}: {
    routines: any[];
    habits: any[];
}) {
    return (
        <>
            <Head title="Routines" />

            <div className="flex flex-col gap-8 p-4 pt-12 sm:p-8 sm:pt-16">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Routines
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Group habits that you usually do together.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <CreateRoutineModal habits={habits} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {routines.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
                            <Repeat className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No routines yet
                            </h3>
                            <p className="mb-6 max-w-sm text-muted-foreground">
                                Create a routine like "Morning Routine" to group
                                related habits.
                            </p>
                            <CreateRoutineModal habits={habits} />
                        </div>
                    ) : (
                        routines.map((routine) => (
                            <Link
                                key={routine.id}
                                href={`/routines/${routine.id}`}
                                className="block"
                            >
                                <article className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Repeat className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl leading-tight font-bold">
                                                    {routine.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {routine.habits?.length ||
                                                        0}{' '}
                                                    habits
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {routine.description && (
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {routine.description}
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

RoutinesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Routines',
            href: '/routines',
        },
    ],
};
