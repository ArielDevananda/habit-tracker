import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { dashboard, register } from '@/routes';

export default function CtaSection() {
    const { auth } = usePage().props;

    return (
        <section className="border-t border-border bg-muted/40 px-6 py-24">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-primary/10 px-6 py-16 text-center shadow-sm sm:px-12">
                <div
                    className="pointer-events-none absolute -top-16 -left-16 size-48 rounded-full bg-primary/20 blur-3xl"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-primary/15 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative z-10">
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Ready to build momentum?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                        Turn small daily actions into lasting routines. Start
                        tracking your habits and see how consistency adds up.
                    </p>

                    <Link
                        href={auth.user ? dashboard() : register()}
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        {auth.user
                            ? 'Open Your Dashboard'
                            : 'Start Your Journey Free'}

                        <ArrowRight className="size-5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
