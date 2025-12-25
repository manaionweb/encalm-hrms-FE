import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Types for Attendance Data
type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Holiday' | 'Weekend';

interface DailyLog {
    date: string; // YYYY-MM-DD
    inTime?: string;
    outTime?: string;
    status: AttendanceStatus;
    hours?: string;
}

export default function Attendance() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchInTime, setPunchInTime] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    // Mock Attendance History for the selected month
    const [attendanceHistory, setAttendanceHistory] = useState<DailyLog[]>([
        { date: '2025-12-01', status: 'Weekend' },
        { date: '2025-12-02', inTime: '09:05', outTime: '18:10', status: 'Present', hours: '9h 5m' },
        { date: '2025-12-03', inTime: '09:00', outTime: '18:00', status: 'Present', hours: '9h 0m' },
        { date: '2025-12-04', inTime: '09:45', outTime: '18:30', status: 'Late', hours: '8h 45m' },
        { date: '2025-12-05', inTime: '09:10', outTime: '18:15', status: 'Present', hours: '9h 5m' },
        // ... more data can be generated
    ]);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handlePunch = () => {
        if (isPunchedIn) {
            // Punch Out Logic
            setIsPunchedIn(false);
            toast.success(`Punched Out successfully at ${currentTime.toLocaleTimeString()}`);
            // real app would save to DB here
        } else {
            // Punch In Logic
            setIsPunchedIn(true);
            setPunchInTime(currentTime);
            toast.success(`Punched In successfully at ${currentTime.toLocaleTimeString()}`);
        }
    };

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
            case 'Absent': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
            case 'Late': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300';
            case 'Holiday': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300';
            case 'Weekend': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Calendar Generation Logic
    const generateCalendarDays = () => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const log = attendanceHistory.find(d => d.date === dateStr);
            const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;

            // Default logic if no log exists
            let displayStatus: AttendanceStatus = log ? log.status : (isWeekend ? 'Weekend' : 'Absent');
            // Check for today
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            days.push(
                <div key={day} className={`h-24 p-2 rounded-xl border ${isToday ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-100 dark:border-white/10'} bg-white dark:bg-brand-800 hover:shadow-md transition-shadow relative group`}>
                    <div className="flex justify-between items-start">
                        <span className={`font-semibold text-sm ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusColor(displayStatus)}`}>
                            {displayStatus}
                        </span>
                    </div>

                    {log && displayStatus !== 'Weekend' && log.inTime && (
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Clock size={10} /> {log.inTime}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                <Clock size={10} /> {log.outTime || '--:--'}
                            </div>
                        </div>
                    )}

                    {/* Add Regularize Button for Absent/Late/Missing Punch */}
                    {!isToday && (displayStatus === 'Absent' || displayStatus === 'Late') && (
                        <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] bg-brand-50 text-brand-600 px-2 py-1 rounded border border-brand-200 hover:bg-brand-100 transition-all">
                            Regularize
                        </button>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="animate-fade-in-up pb-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">My Attendance</h2>
                <p className="text-gray-500 dark:text-gray-400">Track your daily punches and regularization requests.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Punch Widget */}
                <div className="bg-white dark:bg-brand-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-purple-500"></div>

                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white mb-8 tracking-wider">
                        {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                    </div>

                    <div className="relative group">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${isPunchedIn ? 'from-red-600 to-orange-600' : 'from-green-600 to-emerald-600'} rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
                        <button
                            onClick={handlePunch}
                            className={`relative w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl ${isPunchedIn
                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20'
                                : 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600 hover:bg-green-100 dark:hover:bg-green-500/20'
                                }`}
                        >
                            <div className="mb-2">
                                {isPunchedIn ? <Coffee size={48} /> : <MapPin size={48} />}
                            </div>
                            <span className="text-xl font-bold uppercase tracking-wider">{isPunchedIn ? 'Punch Out' : 'Punch In'}</span>
                            <span className="text-xs mt-1 font-medium opacity-70">
                                {isPunchedIn ? 'Enjoy your evening!' : 'Delhi Office (GPS)'}
                            </span>
                        </button>
                    </div>

                    {isPunchedIn && punchInTime && (
                        <div className="mt-6 p-3 bg-brand-50 dark:bg-white/5 rounded-xl flex items-center gap-2 text-sm text-brand-700 dark:text-brand-300">
                            <Clock size={16} />
                            <span>In Time: <strong>{punchInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">22</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">Present Days</p>
                    </div>
                    <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                            <AlertCircle />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">01</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">Absents</p>
                    </div>
                    <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                            <Clock />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">03</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">Late Marks</p>
                    </div>
                    <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <Coffee />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">04</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">Holidays</p>
                    </div>

                    {/* Regularization Alert */}
                    <div className="col-span-2 lg:col-span-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-orange-600" size={20} />
                            <div>
                                <h5 className="font-bold text-orange-800 dark:text-orange-200 text-sm">Regularization Pending</h5>
                                <p className="text-xs text-orange-600 dark:text-orange-300">You have 1 missed punch on 12th Dec. Please regularize.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toast.success('Regularization request has been submitted to your manager.')}
                            className="px-3 py-1.5 bg-white dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-xs font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors"
                        >
                            Fix Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Monthly Calendar View */}
            <div className="bg-white dark:bg-brand-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-brand-500" /> Monthly Log
                    </h3>
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
                        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold w-32 text-center select-none">
                            {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-px mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays()}
                </div>
            </div>
        </div >
    );
}
