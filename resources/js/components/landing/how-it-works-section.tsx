import { CheckCircle2, ListPlus, TrendingUp } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Create your habit',
        description:
            'Add a habit you want to build, choose its schedule, and define a clear goal.',
        icon: ListPlus,
    },
    {
        number: '02',
        title: 'Check in every day',
        description:
            'Mark your habit as completed each day and keep your routine moving forward.',
        icon: CheckCircle2,
    },
    {
        number: '03',
        title: 'Watch your progress',
        description:
            'Review your consistency, current streaks, and progress over time.',
        icon: TrendingUp,
    },
];

export default function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-it-works-title"
            className="scroll-mt-16 px-6 py-24"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                        How it works
                    </p>

                    <h2
                        id="how-it-works-title"
                        className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                    >
                        A simple path to lasting consistency
                    </h2>

                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Start small, take action every day, and let your
                        progress become the motivation to keep going.
                    </p>
                </div>

                <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <li
                                key={step.number}
                                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Icon
                                            className="size-6"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <span className="text-sm font-bold text-primary/60">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-xl font-semibold">
                                    {step.title}
                                </h3>

                                <p className="mt-3 leading-7 text-muted-foreground">
                                    {step.description}
                                </p>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
