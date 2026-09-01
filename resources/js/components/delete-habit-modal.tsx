import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DeleteHabitModal({ habit, children }: { habit: any, children?: React.ReactNode }) {
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
                    className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                    type="button"
                >
                    <Trash2 className="w-4 h-4" />
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
                            Are you sure you want to delete <strong>{habit.name}</strong>? This action cannot be undone and will remove all completion history associated with this habit.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-1 mt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={submit} disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete Habit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
