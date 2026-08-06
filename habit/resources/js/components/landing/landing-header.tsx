import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { dashboard, home, login, register } from '@/routes';

export default function LandingHeader() {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    href={home()}
                    className="text-xl font-bold tracking-tight text-primary"
                    aria-label="Momentum home"
                >
                    Momentum
                </Link>

                <nav
                    className="hidden items-center gap-6 md:flex"
                    aria-label="Main navigation"
                >
                    <a
                        href="#features"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        How it works
                    </a>

                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                Log in
                            </Link>

                            <Link
                                href={register()}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
                    aria-label={
                        isMenuOpen ? 'Close navigation' : 'Open navigation'
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                >
                    {isMenuOpen ? (
                        <X className="size-5" aria-hidden="true" />
                    ) : (
                        <Menu className="size-5" aria-hidden="true" />
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <nav
                    id="mobile-navigation"
                    className="border-t border-border bg-background px-6 py-4 md:hidden"
                    aria-label="Mobile navigation"
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-3">
                        <a
                            href="#features"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                            onClick={closeMenu}
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                            onClick={closeMenu}
                        >
                            How it works
                        </a>

                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-lg px-3 py-2 text-center text-sm font-medium hover:bg-secondary"
                                    onClick={closeMenu}
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={register()}
                                    className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                                    onClick={closeMenu}
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
