import { Head } from '@inertiajs/react';
import CtaSection from '@/components/landing/cta-section';
import FeaturesSection from '@/components/landing/features-section';
import HeroSection from '@/components/landing/hero-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import LandingLayout from '@/layouts/landing-layout';

export default function Welcome() {
    return (
        <>
            <Head title="Build Better Habits">
                <meta
                    name="description"
                    content="Track daily habits, visualize your progress, and build lasting routines with Momentum."
                />
            </Head>

            <LandingLayout>
                <main>
                    <HeroSection />

                    <FeaturesSection />

                    <HowItWorksSection />

                    <CtaSection />
                </main>
            </LandingLayout>
        </>
    );
}
