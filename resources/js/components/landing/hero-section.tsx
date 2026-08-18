import { Link } from '@inertiajs/react';
import { Bolt } from 'lucide-react';
import HeroPreview from '@/components/landing/hero-preview';
import { register } from '@/routes';

export default function HeroSection() {
    return (
        <section className="hero-pattern relative overflow-hidden">
            <div
                className="pointer-events-none absolute top-1/4 right-1/4 size-96 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
            />

            <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
                <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        <Bolt
                            className="size-4 text-primary"
                            aria-hidden="true"
                        />

                        <span>Quiet momentum, significant results</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Build better habits,{' '}
                        <span className="text-primary">one day at a time.</span>
                    </h1>

                    <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                        Momentum is a calm coach for your personal growth. Track
                        daily habits, visualize your progress, and build the
                        life you want without overwhelming pressure.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={register()}
                            className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            Start Your Journey
                        </Link>

                        <a
                            href="#how-it-works"
                            className="rounded-lg bg-secondary px-6 py-3 text-center font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            See How It Works
                        </a>
                    </div>
                </div>

                <HeroPreview />
            </div>
        </section>
    );
}
