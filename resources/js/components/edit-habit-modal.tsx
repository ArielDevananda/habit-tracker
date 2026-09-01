import { router } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DAYS = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
];

export function EditHabitModal({ habit, children }: { habit: any, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [data, setDataState] = useState({
        name: habit.name || '',
        category: habit.category || '',
        type: habit.type || 'binary',
        status: habit.status || 'active',
        frequency: habit.frequency || 'daily',
        days_of_week: habit.days_of_week || ([] as number[]),
        target_value: habit.target_value || '',
        unit: habit.unit || '',
        start_date: habit.start_date ? habit.start_date.split('T')[0] : new Date().toLocaleDateString('en-CA'),
    });

    const setData = (key: string, value: any) => {
        setDataState(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDataState({
                name: habit.name || '',
                category: habit.category || '',
                type: habit.type || 'binary',
                status: habit.status || 'active',
                frequency: habit.frequency || 'daily',
                days_of_week: habit.days_of_week || ([] as number[]),
                target_value: habit.target_value || '',
                unit: habit.unit || '',
                start_date: habit.start_date ? habit.start_date.split('T')[0] : new Date().toLocaleDateString('en-CA'),
            });
            setErrors({});
            setProcessing(false);
        }
    }, [open, habit]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setProcessing(true);

        const payload = {
            ...data,
            target_value: data.target_value === '' ? null : data.target_value,
            days_of_week: data.frequency === 'daily' ? null : data.days_of_week,
        };

        router.put(`/habits/${habit.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                setProcessing(false);
            },
            onError: (errs) => {
                setErrors(errs);
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

    const toggleDay = (day: number) => {
        const currentDays = [...data.days_of_week];

        if (currentDays.includes(day)) {
            setDataState(prev => ({ ...prev, days_of_week: currentDays.filter(d => d !== day) }));
        } else {
            setDataState(prev => ({ ...prev, days_of_week: [...currentDays, day] }));
        }
    };

    return (
        <>
            {children ? (
                <span onClick={handleTriggerClick}>{children}</span>
            ) : (
                <button
                    onClick={handleTriggerClick}
                    className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                    title="Edit"
                    type="button"
                >
                    <Edit className="w-4 h-4" />
                </button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent 
                    className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DialogHeader>
                        <DialogTitle>Edit Habit</DialogTitle>
                        <DialogDescription>
                            Update the details of your habit here.
                        </DialogDescription>
                    </DialogHeader>
                    {Object.keys(errors).length > 0 && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md space-y-1">
                            {Object.entries(errors).map(([key, msg]) => (
                                <div key={key}><strong>{key}:</strong> {msg}</div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Habit Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Drink Water, Read Book"
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <select
                                    id="edit-category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Health">Health 🍏</option>
                                    <option value="Mind">Mind 🧠</option>
                                    <option value="Productivity">Productivity 🚀</option>
                                    <option value="Finance">Finance 💰</option>
                                    <option value="Fitness">Fitness 🏃</option>
                                    <option value="Social">Social 🤝</option>
                                    <option value="General">General 📌</option>
                                </select>
                                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Habit Type <span className="text-destructive">*</span></Label>
                                <select
                                    id="edit-type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="binary">Yes/No (Check-off)</option>
                                    <option value="quantity">Quantity (e.g. 2 Liters)</option>
                                    <option value="duration">Duration (e.g. 30 Mins)</option>
                                    <option value="count">Count (e.g. 50 Pushups)</option>
                                    <option value="avoid">Avoid (e.g. No Sugar)</option>
                                </select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-frequency">Frequency <span className="text-destructive">*</span></Label>
                                <select
                                    id="edit-frequency"
                                    value={data.frequency}
                                    onChange={(e) => setData('frequency', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                                {errors.frequency && <p className="text-sm text-destructive">{errors.frequency}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status <span className="text-destructive">*</span></Label>
                                <select
                                    id="edit-status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="archived">Archived</option>
                                </select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                        </div>

                        {data.frequency === 'weekly' && (
                            <div className="space-y-3 p-3 bg-muted/50 rounded-lg border border-border">
                                <Label>Select Days <span className="text-destructive">*</span></Label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map((day) => {
                                        const isSelected = data.days_of_week.includes(day.value);

                                        return (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={`w-10 h-10 rounded-full text-xs font-medium transition-colors ${
                                                    isSelected 
                                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                                        : 'bg-background border border-input text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.days_of_week && <p className="text-sm text-destructive">{errors.days_of_week}</p>}
                            </div>
                        )}

                        {['quantity', 'duration', 'count'].includes(data.type) && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-target_value">Target (Number) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="edit-target_value"
                                        type="number"
                                        step="0.01"
                                        value={data.target_value}
                                        onChange={(e) => setData('target_value', e.target.value)}
                                        placeholder="e.g. 2"
                                        required
                                    />
                                    {errors.target_value && <p className="text-sm text-destructive">{errors.target_value}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-unit">Unit / Satuan <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="edit-unit"
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        placeholder="e.g. Liters, Mins"
                                        required
                                    />
                                    {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
