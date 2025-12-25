import { Users, UserMinus, UserCheck, Clock } from 'lucide-react';

export default function HeadcountStats() {
    const stats = [
        { label: 'Total Headcount', value: '452', icon: Users, color: 'text-brand-500', bg: 'bg-brand-50' },
        { label: 'On Leave Today', value: '12', icon: UserMinus, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'New Joiners', value: '5', icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Avg Attendance', value: '92%', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-white/5`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
