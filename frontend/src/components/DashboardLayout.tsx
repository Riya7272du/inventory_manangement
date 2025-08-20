import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

interface User {
    name: string;
    email: string;
    role: string;
}

interface DashboardLayoutProps {
    user: User;
    onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    user,
    onLogout
}) => {
    const location = useLocation();

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { key: 'inventory', label: 'Inventory', path: '/inventory' },
        { key: 'suppliers', label: 'Suppliers', path: '/suppliers' },
        { key: 'transactions', label: 'Transactions', path: '/transactions' },
        { key: 'reports', label: 'Reports', path: '/reports' },
    ];

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            onLogout();
        } catch (error) {
            console.error('Logout error:', error);
            onLogout();
        }
    };

    const getCurrentPage = () => {
        const path = location.pathname;
        return navItems.find(item => item.path === path)?.key || 'dashboard';
    };

    return (
        <div
            className="min-h-screen grid grid-rows-[64px_1fr] grid-cols-[260px_1fr] text-slate-100 font-sans"
            style={{
                background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)'
            }}
        >

            <header className="col-span-2 flex items-center justify-between px-5 border-b border-slate-700/50" style={{ backgroundColor: '#161a2f' }}>
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span className="font-bold text-lg">Inventory</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-2 border border-slate-600/50 rounded-full text-sm" style={{ backgroundColor: 'rgba(110, 139, 255, 0.1)' }}>
                        {user.email} <span className="text-slate-400 ml-2">{user.role}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-600/30 transition-colors"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <aside className="p-4 border-r border-slate-700/50" style={{ backgroundColor: '#161a2f' }}>
                <div className="mb-4">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mx-2 mb-3">
                        MAIN
                    </div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = getCurrentPage() === item.key;
                            return (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all
                                        ${isActive
                                            ? 'text-blue-400 border'
                                            : 'text-slate-300 hover:bg-slate-700/30 border border-transparent'
                                        }
                                    `}
                                    style={isActive ? {
                                        background: 'linear-gradient(180deg, rgba(110,139,255,0.12), rgba(110,139,255,0.02))',
                                        borderColor: 'rgba(110,139,255,0.35)'
                                    } : {}}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <main className="p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export { DashboardLayout };