import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export function DeleteHabitModal({
    habit,
    children,
}: {
    habit: any;
    children?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const submit = () => {
        setProcessing(true);
        router.delete(`/habits/${habit.id}`, {
            onSuccess: () => {
                setOpen(false);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            {children ? (
                <span onClick={handleTriggerClick}>{children}</span>
            ) : (
                <button
                    onClick={handleTriggerClick}
                    className="rounded-full p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                    title="Delete"
                    type="button"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="sm:max-w-[425px]"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DialogHeader>
                        <DialogTitle>Delete Habit</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{habit.name}</strong>? This action cannot be
                            undone and will remove all completion history
                            associated with this habit.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2 sm:gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submit}
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Delete Habit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
