import {
    BookOpen,
    CheckCircle2,
    Circle,
    Droplets,
    Dumbbell,
    Flame,
} from 'lucide-react';

const sampleHabits = [
    {
        name: 'Morning Read',
        goal: '20 minutes',
        icon: BookOpen,
        completed: true,
    },
    {
        name: 'Drink Water',
        goal: '8 glasses',
        icon: Droplets,
        completed: true,
    },
    {
        name: 'Exercise',
        goal: '30 minutes',
        icon: Dumbbell,
        completed: false,
    },
];

export default function HeroPreview() {
    return (
        <div
            className="relative hidden min-h-[480px] lg:block"
            aria-hidden="true"
        >
            <div className="absolute inset-6 rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-primary/10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Today
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold text-card-foreground">
                            Keep your momentum
                        </h2>
                    </div>

                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        75%
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Daily progress
                        </span>

                        <span className="font-medium text-card-foreground">
                            3 of 4
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    {sampleHabits.map((habit) => {
                        const Icon = habit.icon;

                        return (
                            <div
                                key={habit.name}
                                className={
                                    habit.completed
                                        ? 'flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4'
                                        : 'flex items-center gap-3 rounded-2xl border border-border bg-background p-4'
                                }
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                                    <Icon className="size-5 text-secondary-foreground" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-foreground">
                                        {habit.name}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {habit.goal}
                                    </p>
                                </div>

                                {habit.completed ? (
                                    <CheckCircle2 className="size-6 shrink-0 text-primary" />
                                ) : (
                                    <Circle className="size-6 shrink-0 text-muted-foreground" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="absolute top-16 -left-2 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Flame className="size-5 text-primary" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-foreground">
                            7 day streak
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Personal best!
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute right-0 bottom-14 w-44 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur">
                <p className="text-xs font-medium text-muted-foreground">
                    Weekly consistency
                </p>

                <div className="mt-3 flex items-end gap-1">
                    {[40, 65, 50, 80, 70, 90, 75].map((height, index) => (
                        <div
                            key={index}
                            className="flex h-16 flex-1 items-end rounded-full bg-secondary"
                        >
                            <div
                                className="w-full rounded-full bg-primary"
                                style={{ height: `${height}%` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
