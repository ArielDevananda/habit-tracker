import { Link } from '@inertiajs/react';
import { home } from '@/routes';

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-background px-6 py-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                <Link
                    href={home()}
                    className="text-lg font-bold tracking-tight text-primary"
                    aria-label="Momentum home"
                >
                    Momentum
                </Link>

                <nav
                    className="flex items-center gap-6"
                    aria-label="Footer navigation"
                >
                    <a
                        href="#features"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        How it works
                    </a>
                </nav>

                <p className="text-center text-sm text-muted-foreground">
                    © {currentYear} Momentum. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
