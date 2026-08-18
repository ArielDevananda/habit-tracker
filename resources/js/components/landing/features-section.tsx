import {
    CalendarDays,
    ChartNoAxesCombined,
    Flame,
    ListChecks,
} from 'lucide-react';
import FeatureCard from '@/components/landing/feature-card';
import type { FeatureCardProps } from '@/components/landing/feature-card';

const features: FeatureCardProps[] = [
    {
        title: 'Effortless Tracking',
        description:
            'Complete daily habits with a simple interaction and keep your focus on taking small, consistent actions.',
        icon: ListChecks,
        tone: 'primary',
        wide: true,
        tags: ['Daily check-in', 'Simple progress', 'Personal notes'],
    },
    {
        title: 'Visual Progress',
        description:
            'Understand your consistency through clear weekly progress and completion statistics.',
        icon: ChartNoAxesCombined,
        tone: 'violet',
    },
    {
        title: 'Flexible Scheduling',
        description:
            'Choose when each habit should be completed without forcing every habit into the same routine.',
        icon: CalendarDays,
        tone: 'blue',
    },
    {
        title: 'Streaks That Motivate',
        description:
            'Celebrate consistent progress through current streaks, personal records, and meaningful milestones.',
        icon: Flame,
        tone: 'primary',
        wide: true,
        tags: ['Current streak', 'Personal best', 'Milestones'],
    },
];

export default function FeaturesSection() {
    return (
        <section
            id="features"
            className="scroll-mt-16 border-y border-border bg-muted/40 px-6 py-24"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                        Built for consistency
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Everything you need to build better habits
                    </h2>

                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        A calm and focused set of tools designed to help you
                        take action, understand your progress, and stay
                        consistent.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
