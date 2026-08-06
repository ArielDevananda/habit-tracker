import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const toneClasses = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-chart-3/10 text-chart-3',
    violet: 'bg-chart-4/10 text-chart-4',
} as const;

export type FeatureCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    tone?: keyof typeof toneClasses;
    wide?: boolean;
    tags?: readonly string[];
};

export default function FeatureCard({
    title,
    description,
    icon: Icon,
    tone = 'primary',
    wide = false,
    tags,
}: FeatureCardProps) {
    return (
        <article
            className={cn(
                'group relative min-h-64 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none',
                wide && 'md:col-span-2',
            )}
        >
            <div className="relative z-10 flex h-full flex-col">
                <div
                    className={cn(
                        'flex size-12 items-center justify-center rounded-2xl',
                        toneClasses[tone],
                    )}
                >
                    <Icon className="size-6" aria-hidden="true" />
                </div>

                <div className="mt-6 max-w-lg">
                    <h3 className="text-xl font-semibold tracking-tight text-card-foreground">
                        {title}
                    </h3>

                    <p className="mt-3 leading-7 text-muted-foreground">
                        {description}
                    </p>
                </div>

                {tags && tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div
                className={cn(
                    'pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70',
                    toneClasses[tone],
                )}
                aria-hidden="true"
            />
        </article>
    );
}
