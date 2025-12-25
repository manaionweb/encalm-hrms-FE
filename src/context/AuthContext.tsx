import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available roles
export type UserRole = 'HR_ADMIN' | 'EMPLOYEE' | 'MANAGER';

interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    tenantId: string;
    token?: string;
    accessibleModules?: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: UserRole) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize from local storage to persist login across refreshes
    useEffect(() => {
        const storedUser = localStorage.getItem('encalm_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, role: UserRole) => {
        // Mock login
        const userData: User = {
            id: 1, // Changed to number to match interface
            name: 'Demo User',
            email,
            role,
            tenantId: 'tenant-1',
            accessibleModules: ['DASHBOARD', 'ATTENDANCE', 'EMPLOYEE', 'TEAM', 'LEAVE', 'REPORTS', 'MASTERS', 'TASK']
        };
        setUser(userData);
        localStorage.setItem('encalm_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('encalm_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
