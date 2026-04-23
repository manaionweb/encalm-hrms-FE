import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <header className="h-16 bg-transparent flex items-center justify-between px-4 md:px-8 py-4 mb-4 md:mb-8">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
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
                <div className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm hover:shadow-md cursor-pointer text-brand-500 dark:text-brand-300 transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-transparent"></span>
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

                {user && (
                    <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200 ml-2">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase().replace('_', ' ') || 'User'}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
