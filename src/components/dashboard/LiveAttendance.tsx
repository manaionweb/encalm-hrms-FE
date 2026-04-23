import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LiveAttendanceProps {
    data: { name: string; visitors: number }[];
}

export default function LiveAttendance({ data }: LiveAttendanceProps) {
    // Mock robust websocket connection
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 h-96 flex flex-col group">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Live Attendance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">Real-time check-ins today</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 rounded-full border border-green-100 dark:border-green-500/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Live</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                            contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 'bold', color: '#1f2937' }}
                        />
                        <Bar dataKey="visitors" radius={[8, 8, 8, 8]} barSize={28}>
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIndex === index ? '#8b5cf6' : '#e2e8f0'}
                                    className="transition-all duration-300 dark:fill-gray-700/50"
                                    style={{ filter: activeIndex === index ? 'drop-shadow(0px 10px 15px rgba(139, 92, 246, 0.4))' : 'none' }}
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
