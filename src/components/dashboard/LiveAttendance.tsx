import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: '09:00', visitors: 40 },
    { name: '10:00', visitors: 120 },
    { name: '11:00', visitors: 180 },
    { name: '12:00', visitors: 150 },
    { name: '13:00', visitors: 90 },
    { name: '14:00', visitors: 160 },
    { name: '15:00', visitors: 140 },
];

export default function LiveAttendance() {
    // Mock robust websocket connection
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Live Attendance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time check-ins today</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-green-500">Live</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="visitors" radius={[6, 6, 6, 6]} barSize={32}>
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIndex === index ? '#8b5cf6' : '#e0e7ff'}
                                    className="transition-all duration-300 hover:opacity-80 dark:fill-brand-700 dark:hover:fill-brand-500"
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
