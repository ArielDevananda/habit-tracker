import { Head } from '@inertiajs/react';
import {
    Lightbulb,
    Flame,
    Calendar,
    TrendingUp,
    TrendingDown,
    Sun,
    Moon,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function InsightsIndex({ insights }: { insights: any[] }) {
    // Map icon strings to actual Lucide components
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Flame':
                return <Flame className="h-8 w-8 text-orange-500" />;
            case 'Calendar':
                return <Calendar className="h-8 w-8 text-blue-500" />;
            case 'TrendingUp':
                return <TrendingUp className="h-8 w-8 text-green-500" />;
            case 'TrendingDown':
                return <TrendingDown className="h-8 w-8 text-red-500" />;
            case 'Sun':
                return <Sun className="h-8 w-8 text-yellow-500" />;
            case 'Moon':
                return <Moon className="h-8 w-8 text-indigo-500" />;
            default:
                return <Lightbulb className="h-8 w-8 text-yellow-500" />;
        }
    };

    return (
        <>
            <Head title="Insights" />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                    <Lightbulb className="h-8 w-8 text-yellow-500" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Your Insights
                        </h1>
                        <p className="text-muted-foreground">
                            Personalized observations based on your habit
                            history.
                        </p>
                    </div>
                </div>

                {insights.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Lightbulb className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h2 className="mb-2 text-xl font-semibold">
                                Not enough data yet
                            </h2>
                            <p className="max-w-md text-muted-foreground">
                                We need more data to generate insights. Keep
                                checking in on your habits, and we'll show you
                                trends and suggestions here!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {insights.map((insight, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="rounded-full bg-muted p-3">
                                        {getIcon(insight.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">
                                            {insight.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mt-2 text-base text-foreground/80">
                                        {insight.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

InsightsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Insights',
            href: '/insights',
        },
    ],
};
