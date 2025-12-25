import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, XCircle } from 'lucide-react';

// Mock Data
const LEAVE_BALANCES = [
    { type: 'Privilege Leave', code: 'PL', balance: 12, total: 18, color: 'text-purple-600', bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/30' },
    { type: 'Casual Leave', code: 'CL', balance: 4, total: 10, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/30' },
    { type: 'Sick Leave', code: 'SL', balance: 5, total: 10, color: 'text-pink-600', bg: 'bg-pink-100', darkBg: 'dark:bg-pink-900/30' },
];

const HOLIDAYS = [
    { date: '2025-12-25', name: 'Christmas Day' },
    { date: '2026-01-26', name: 'Republic Day' },
];

const MY_LEAVES = [
    { id: 1, startDate: '2025-12-10', endDate: '2025-12-12', type: 'PL', reason: 'Family Vacation', status: 'Approved' },
    { id: 2, startDate: '2025-12-28', endDate: '2025-12-29', type: 'CL', reason: 'Personal Work', status: 'Pending' },
];

// Helper to check if a date string matches a leave or holiday
const getDateStatus = (dateStr: string) => {
    const holiday = HOLIDAYS.find(h => h.date === dateStr);
    if (holiday) return { type: 'Holiday', label: holiday.name };

    const leave = MY_LEAVES.find(l => dateStr >= l.startDate && dateStr <= l.endDate);
    if (leave) return { type: 'Leave', label: leave.type, status: leave.status };

    return null;
};

export default function Leave() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showApplyModal, setShowApplyModal] = useState(false);

    // Form State
    const [leaveType, setLeaveType] = useState('CL');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');

    const handleApplyLeave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Leave application submitted!');
        setShowApplyModal(false);
    };

    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Headers
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.push(
            <div key="headers" className="grid grid-cols-7 mb-2">
                {weekDays.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase py-2">{d}</div>)}
            </div>
        );

        const dayCells = [];

        // Empty slots
        for (let i = 0; i < startingDayOfWeek; i++) {
            dayCells.push(<div key={`empty-${i}`} className="h-20 sm:h-24 bg-gray-50/30 dark:bg-white/5 border border-transparent rounded-lg"></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = getDateStatus(dateStr);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isSelected = selectedDate?.toDateString() === new Date(year, month, day).toDateString();

            let bgClass = "bg-white dark:bg-brand-800";
            let statusBadge = null;

            if (status?.type === 'Holiday') {
                bgClass = "bg-purple-50 dark:bg-purple-900/20 border-purple-200";
                statusBadge = <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded truncate w-full block text-center mt-1">{status.label}</span>;
            } else if (status?.type === 'Leave') {
                bgClass = status.status === 'Approved' ? "bg-green-50 dark:bg-green-900/20 border-green-200" : "bg-orange-50 dark:bg-orange-900/20 border-orange-200";
                statusBadge = <span className={`text-[10px] px-1.5 rounded w-full block text-center mt-1 ${status.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{status.label}</span>;
            }

            dayCells.push(
                <div
                    key={day}
                    onClick={() => { setSelectedDate(new Date(year, month, day)); if (!status) { setFromDate(dateStr); setToDate(dateStr); setShowApplyModal(true); } }}
                    className={`h-20 sm:h-24 p-2 rounded-xl border transition-all cursor-pointer relative group ${bgClass} ${isSelected ? 'ring-2 ring-brand-500 z-10' : 'border-gray-100 dark:border-white/10 hover:border-brand-300'}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-semibold ${isToday ? 'bg-brand-500 text-white w-6 h-6 rounded-full flex items-center justify-center -ml-1 -mt-1 shadow-md' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                    </div>
                    {statusBadge}

                    {!status && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 dark:bg-black/50 backdrop-blur-[1px] rounded-xl">
                            <Plus size={20} className="text-brand-600 font-bold" />
                        </div>
                    )}
                </div>
            );
        }

        days.push(<div key="days" className="grid grid-cols-7 gap-2">{dayCells}</div>);
        return days;
    };

    return (
        <div className="animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leave Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">View balances and plan your holidays.</p>
                </div>
                <button
                    onClick={() => setShowApplyModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all"
                >
                    <Plus size={20} /> Apply Leave
                </button>
            </div>

            {/* Balances Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {LEAVE_BALANCES.map((bal) => (
                    <div key={bal.code} className="bg-white dark:bg-brand-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${bal.bg} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500`}></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">{bal.type}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className={`text-4xl font-bold ${bal.color}`}>{bal.balance}</span>
                                    <span className="text-gray-400 text-sm">/ {bal.total}</span>
                                </div>
                            </div>
                            <div className={`w-10 h-10 ${bal.bg} ${bal.darkBg} rounded-xl flex items-center justify-center ${bal.color}`}>
                                <CalendarIcon size={20} />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${bal.color.replace('text', 'bg')}`} style={{ width: `${(bal.balance / bal.total) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Calendar Section */}
                <div className="lg:col-span-2 bg-white dark:bg-brand-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <CalendarIcon size={20} className="text-brand-500" /> Leave Calendar
                        </h3>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold w-32 text-center select-none text-gray-700 dark:text-white">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    {generateCalendar()}
                </div>

                {/* History & Upcoming */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">My Leave History</h3>
                        <div className="space-y-4">
                            {MY_LEAVES.map(leave => (
                                <div key={leave.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${leave.status === 'Approved' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 dark:text-white text-sm">{leave.type} - {leave.reason}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(leave.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors">
                            View All History
                        </button>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-500/20">
                        <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Upcoming Holiday</h4>
                        <div className="flex items-center gap-4">
                            <div className="bg-white dark:bg-purple-900/40 p-3 rounded-xl text-center min-w-[60px]">
                                <span className="block text-xs font-bold text-purple-400 uppercase">Dec</span>
                                <span className="block text-2xl font-bold text-purple-600">25</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">Christmas Day</p>
                                <p className="text-xs text-purple-500">Wednesday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-brand-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
                        {/* Modal Header containing BG Pattern */}
                        <div className="bg-brand-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Apply for Leave</h3>
                                <button onClick={() => setShowApplyModal(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                    <XCircle size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Leave Type</label>
                                    <select
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none"
                                    >
                                        <option value="CL">Casual Leave (CL)</option>
                                        <option value="PL">Privilege Leave (PL)</option>
                                        <option value="SL">Sick Leave (SL)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                                    <input
                                        type="text"
                                        placeholder="Vacation, Personal..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">From Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">To Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowApplyModal(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
