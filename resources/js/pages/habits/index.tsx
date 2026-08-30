import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Edit, Trash2, Clock, Activity, Book, Flame } from 'lucide-react';
import { EditHabitModal } from '@/components/edit-habit-modal';

export default function HabitsIndex({ habits = [] }: { habits?: any[] }) {
    const [activeFilter, setActiveFilter] = useState('All Active');
    
    // Get unique categories from the user's habits (ignoring null/empty)
    const availableCategories = Array.from(new Set(habits.map(h => h.category).filter(Boolean)));
    
    // Filter habits based on selected category
    const filteredHabits = activeFilter === 'All Active' 
        ? habits 
        : habits.filter(h => h.category === activeFilter);

    return (
        <>
            <Head title="My Habits" />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 max-w-7xl w-full mx-auto py-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">My Habits</h2>
                    <p className="text-base text-muted-foreground mt-1">Manage all your tracked habits</p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto snap-x hide-scrollbar">
                        <button 
                            onClick={() => setActiveFilter('All Active')}
                            className={`snap-start shrink-0 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all active:scale-95 ${activeFilter === 'All Active' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
                        >
                            All Active
                        </button>
                        {availableCategories.map((cat: any) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`snap-start shrink-0 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all active:scale-95 ${activeFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort by:</span>
                        <select className="bg-transparent border-none text-base font-medium text-primary focus:ring-0 cursor-pointer py-1 pl-1 pr-6">
                            <option>Streak (High to Low)</option>
                            <option>Name (A-Z)</option>
                            <option>Recent</option>
                        </select>
                    </div>
                </div>

                {/* Bento Grid / Cards List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredHabits.length === 0 ? (
                        <div className="col-span-full bg-card rounded-xl p-8 border border-border border-dashed flex flex-col items-center justify-center text-center">
                            <p className="text-muted-foreground mb-4">No habits found.</p>
                        </div>
                    ) : (
                        filteredHabits.map((habit: any) => (
                            <article key={habit.id} className="bg-card rounded-xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 relative group border border-border hover:-translate-y-0.5 hover:shadow-md transition-all">
                                {/* Actions Menu (Hover) */}
                                <div className="absolute top-4 right-4 opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-2">
                                    <EditHabitModal habit={habit} />
                                    <button 
                                        className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors" 
                                        title="Delete"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this habit?')) {
                                                router.delete(`/habits/${habit.id}`);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            {habit.category === 'Health' ? <span className="text-xl">🍏</span> :
                                             habit.category === 'Mind' ? <span className="text-xl">🧠</span> :
                                             habit.category === 'Productivity' ? <span className="text-xl">🚀</span> :
                                             habit.category === 'Finance' ? <span className="text-xl">💰</span> :
                                             habit.category === 'Fitness' ? <span className="text-xl">🏃</span> :
                                             habit.category === 'Social' ? <span className="text-xl">🤝</span> :
                                             <span className="text-xl">📌</span>}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground leading-tight">{habit.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                                                {habit.frequency} {habit.target_value ? `• ${habit.target_value} ${habit.unit}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {habit.category && (
                                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs font-medium">
                                                {habit.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-start sm:items-end sm:border-l border-border sm:pl-6 min-w-[120px]">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-primary leading-none">
                                            {habit.completions_count || 0}
                                        </span>
                                        <span className="text-sm font-medium text-muted-foreground">total</span>
                                    </div>
                                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                        <Flame className="w-3 h-3" /> Completions
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

HabitsIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Habits',
            href: '/habits',
        },
    ],
};
