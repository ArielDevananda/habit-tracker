import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const DAYS = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
];

export function CreateHabitModal({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: '',
        frequency: 'daily',
        days_of_week: [] as number[],
        target_value: '',
        unit: '',
        start_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/habits', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const toggleDay = (day: number) => {
        const currentDays = [...data.days_of_week];
        if (currentDays.includes(day)) {
            setData('days_of_week', currentDays.filter(d => d !== day));
        } else {
            setData('days_of_week', [...currentDays, day]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Habit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Habit</DialogTitle>
                    <DialogDescription>
                        Set up a new habit to track your daily progress.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Habit Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Drink Water, Read Book"
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
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
                            <Label htmlFor="frequency">Frequency <span className="text-destructive">*</span></Label>
                            <select
                                id="frequency"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="target_value">Target (Number)</Label>
                            <Input
                                id="target_value"
                                type="number"
                                step="0.01"
                                value={data.target_value}
                                onChange={(e) => setData('target_value', e.target.value)}
                                placeholder="e.g. 2"
                            />
                            {errors.target_value && <p className="text-sm text-destructive">{errors.target_value}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit / Satuan</Label>
                            <Input
                                id="unit"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                placeholder="e.g. Liters, Pages"
                            />
                            {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Habit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
