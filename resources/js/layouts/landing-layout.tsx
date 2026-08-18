import type { PropsWithChildren } from 'react';
import LandingFooter from '@/components/landing/landing-footer';
import LandingHeader from '@/components/landing/landing-header';

export default function LandingLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            <LandingHeader />

            <div className="pt-16">{children}</div>

            <LandingFooter />
        </div>
    );
}
