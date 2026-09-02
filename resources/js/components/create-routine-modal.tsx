import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateRoutineModal({
    children,
    habits,
}: {
    children?: React.ReactNode;
    habits: Array<{ id: number; name: string }>;
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        icon: '',
        status: 'active',
        habit_ids: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/routines', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Routine
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create New Routine</DialogTitle>
                        <DialogDescription>
                            Group habits that you usually do together.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Routine Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Morning Routine"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {habits && habits.length > 0 && (
                            <div className="grid gap-2">
                                <Label>Select Habits</Label>
                                <div className="flex flex-col gap-2 rounded-md border border-input p-3">
                                    {habits.map((habit) => (
                                        <label
                                            key={habit.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                                                checked={data.habit_ids.includes(
                                                    habit.id,
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('habit_ids', [
                                                            ...data.habit_ids,
                                                            habit.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            'habit_ids',
                                                            data.habit_ids.filter(
                                                                (id) =>
                                                                    id !==
                                                                    habit.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                            {habit.name}
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Select in the order you want to do them.
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Routine
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
