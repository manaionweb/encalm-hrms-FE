import { Search, Bell, Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
interface HeaderProps {
    onMenuClick: () => void;
}
export default function Header({ onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const roleLabel = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "Employee";
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ================= DEMO DATA & FETCH LOGIC =================
    // TODO (Backend Dev): Replace with your API fetching logic
    const demoNotifications = [
        {
            id: 1,
            type: "success",
            title: "Sheets Submitted",
            message: "12 answer sheets submitted",
            time: "2 mins ago",
        },
        {
            id: 2,
            type: "warning",
            title: "Pending Review",
            message: "5 sheets waiting approval",
            time: "10 mins ago",
        },
    ];

    async function fetchNotifications() {
        setLoading(true);
        try {
            setTimeout(() => {
                setNotifications(demoNotifications);
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error("Failed to load notifications", error);
            setLoading(false);
        }
    }
    function openNotifications() {
        const next = !showNotifications;
        setShowNotifications(next);

        if (next) {
            fetchNotifications();
        }
    }
    function openProfile() {
        setShowProfile(!showProfile);
    }
    function handleLogout() {
        logout();
        navigate('/signin');
    }
    return (
        <>
            <header className="h-16 bg-transparent flex items-center justify-between px-4 md:px-8 py-4 mb-4 md:mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden md:block p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm hover:shadow-md cursor-pointer text-brand-500 dark:text-brand-300 transition-all">
                        <Search size={20} />
                    </div>
                    <div
                        onClick={openNotifications}
                        className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm hover:shadow-md dark:hover:bg-white/10 cursor-pointer text-brand-500 dark:text-brand-300 transition-all relative"
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-brand-100/50 hover:bg-brand-100 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white rounded-xl text-brand-700 font-medium text-sm transition-all"
                    >
                        {theme === 'dark' ? (
                            <><span className="hidden md:inline">Light mode</span> <Sun size={16} /></>
                        ) : (
                            <><span className="hidden md:inline">Night mode</span> <Moon size={16} /></>
                        )}
                    </button>
                    <div
                        onClick={openProfile}
                        className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-white/10 ml-2 cursor-pointer group"
                    >
                        <div className="text-right hidden md:block transition-transform group-hover:-translate-x-1">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-brand-400">
                                {roleLabel}
                            </p>
                        </div>

                        <img
                            src="/raman-thakur.jpg"
                            alt="profile"
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-brand-800 shadow-sm object-cover transition-transform group-hover:scale-105"
                        />
                    </div>

                </div>
            </header>
            {showNotifications && (
                <>
                    <div
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowNotifications(false)}
                    />

                    <div className="fixed top-0 right-0 z-[9999] h-screen w-full max-w-[400px] bg-white dark:bg-brand-950 border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col animate-fade-in-up">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Notifications
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Recent updates
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowNotifications(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-3 overflow-y-auto flex-1">
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                                    <div className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                                </div>
                            ) : (
                                notifications.map((n, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-brand-500/30 dark:hover:border-brand-400/30 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                {n.title}
                                            </p>
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-md">
                                                {n.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {n.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
            {showProfile && (
                <>
                    <div
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowProfile(false)}
                    />

                    <div className="fixed top-0 right-0 z-[9999] h-screen w-full max-w-[400px] bg-white dark:bg-brand-950 border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col animate-fade-in-up">
                        <div className="relative h-32 bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-900 shadow-inner">
                            <button 
                                onClick={() => setShowProfile(false)}
                                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="px-6 flex flex-col items-center -mt-14 mb-6">
                            <div className="relative">
                                <img
                                    src="/raman-thakur.jpg"
                                    alt="profile"
                                    className="w-28 h-28 rounded-full border-4 border-white dark:border-brand-950 shadow-lg object-cover bg-white"
                                />
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-brand-950 rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                                {user?.name || "User"}
                            </h2>
                            <p className="text-sm font-medium text-brand-600 dark:text-brand-400 px-4 py-1.5 bg-brand-50 dark:bg-brand-900/30 rounded-full mt-2 border border-brand-100 dark:border-brand-800">
                                {roleLabel}
                            </p>
                        </div>
                        <div className="px-6 space-y-4 flex-1">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors hover:border-gray-200 dark:hover:border-white/10">
                                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Email Address</p>
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.email || "No email available"}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors hover:border-gray-200 dark:hover:border-white/10">
                                <div className="w-12 h-12 rounded-full bg-mint-100 dark:bg-mint-900/50 flex items-center justify-center text-mint-600 dark:text-mint-400 shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Account Status</p>
                                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-white/10 mt-auto flex gap-3">
                            <button
                                onClick={() => setShowProfile(false)}
                                className="flex-1 py-3 px-4 flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl transition-all font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3 px-4 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}