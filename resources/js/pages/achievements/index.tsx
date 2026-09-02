import { Head } from '@inertiajs/react';
import { Trophy, Flame, Star, Lock } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

export default function AchievementsIndex({
    achievements,
}: {
    achievements: Achievement[];
}) {
    // Map icon strings to actual Lucide components
    const getIcon = (iconName: string, unlocked: boolean) => {
        const className = cn(
            'h-10 w-10',
            unlocked ? 'text-yellow-500' : 'text-muted-foreground',
        );

        if (!unlocked) {
            return <Lock className={className} />;
        }

        switch (iconName) {
            case 'Flame':
                return <Flame className={className} />;
            case 'Star':
                return <Star className={className} />;
            case 'Trophy':
                return <Trophy className={className} />;
            default:
                return <Trophy className={className} />;
        }
    };

    return (
        <>
            <Head title="Achievements" />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Achievements
                        </h1>
                        <p className="text-muted-foreground">
                            Unlock badges by reaching milestones and building
                            consistent habits.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
                    {achievements.map((achievement) => (
                        <Card
                            key={achievement.id}
                            className={cn(
                                'overflow-hidden transition-all duration-300',
                                achievement.unlocked
                                    ? 'border-yellow-500/50 shadow-md shadow-yellow-500/10'
                                    : 'bg-muted/30 opacity-75 grayscale',
                            )}
                        >
                            <CardHeader className="flex flex-col items-center pt-6 pb-2 text-center">
                                <div
                                    className={cn(
                                        'mb-2 rounded-full p-4',
                                        achievement.unlocked
                                            ? 'bg-yellow-500/10'
                                            : 'bg-muted',
                                    )}
                                >
                                    {getIcon(
                                        achievement.icon,
                                        achievement.unlocked,
                                    )}
                                </div>
                                <CardTitle className="text-xl">
                                    {achievement.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription className="text-sm">
                                    {achievement.description}
                                </CardDescription>
                                {achievement.unlocked ? (
                                    <div className="mt-4 inline-flex items-center rounded-full border border-green-600/20 bg-green-600/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                                        Unlocked
                                    </div>
                                ) : (
                                    <div className="mt-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                        Locked
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

AchievementsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Achievements',
            href: '/achievements',
        },
    ],
};
