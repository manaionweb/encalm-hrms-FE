import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import HeadcountStats from '../components/dashboard/HeadcountStats';
import LiveAttendance from '../components/dashboard/LiveAttendance';

export default function DashboardHome() {
    const navigate = useNavigate();

    return (
        <div className="text-gray-800 dark:text-white animate-fade-in-up">
            <header className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
            </header>

            {/* Regularization Alert */}
            <div className="mb-8 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-orange-600" size={20} />
                    <div>
                        <h5 className="font-bold text-orange-800 dark:text-orange-200 text-sm">Regularization Pending</h5>
                        <p className="text-xs text-orange-600 dark:text-orange-300">You have 1 missed punch on 12th Dec. Please regularize.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/attendance')}
                    className="px-3 py-1.5 bg-white dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-xs font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors"
                >
                    Fix Now
                </button>
            </div>

            {/* Key Metrics Widgets */}
            <HeadcountStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Attendance Chart */}
                <div className="lg:col-span-2">
                    <LiveAttendance />
                </div>

                {/* Pending Approvals / Activity Feed Placeholder */}
                <div className="lg:col-span-1 bg-white dark:bg-brand-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-96">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Pending Approvals</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    AM
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold dark:text-gray-200">Arjun Mehta</h4>
                                    <p className="text-xs text-gray-500">Requested Leave • 2 days</p>
                                </div>
                                <button className="text-xs font-semibold text-brand-500 hover:text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg">
                                    Review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employee Overview Table */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Employee Overview</h3>
                    <button
                        onClick={() => navigate('/employee')}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                        View All
                    </button>
                </div>
                <div className="bg-white dark:bg-brand-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-white/10">
                                    <th className="py-4 px-6 font-medium">Name</th>
                                    <th className="py-4 px-6 font-medium">Role</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {['Vikram Malhotra', 'Sneha Gupta', 'Rohan Das', 'Anjali Rao', 'Amit Patel'].map((name, index) => (
                                    <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-none">
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                {name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-semibold text-gray-700 dark:text-gray-200">{name}</span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{index % 2 === 0 ? 'Senior Developer' : 'Product Designer'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${index === 3
                                                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                                                : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                                                }`}>
                                                {index === 3 ? 'Inactive' : 'Active'}
                                            </span>
                                        </td>
                                        <td
                                            className="py-4 px-6 text-brand-600 dark:text-brand-400 font-medium cursor-pointer hover:underline"
                                            onClick={() => navigate('/employee/1')}
                                        >
                                            View Profile
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
