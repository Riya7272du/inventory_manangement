import React, { useState } from 'react';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div
            className="min-h-screen text-slate-100 font-sans"
            style={{
                background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)'
            }}
        >
            <div className="lg:hidden flex flex-col h-screen">
                <header className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0" style={{ backgroundColor: '#161a2f' }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-green-500"></div>
                        <span className="font-bold text-lg">Inventory</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-2 border border-slate-600/50 rounded-lg hover:bg-slate-600/30 transition-colors text-sm"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    >
                        Logout
                    </button>
                </header>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black/50"
                            onClick={closeSidebar}
                            aria-label="Close menu"
                        ></div>
                        <aside className="relative w-72 max-w-xs h-full flex flex-col border-r border-slate-700/50" style={{ backgroundColor: '#161a2f' }}>
                            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-green-500"></div>
                                    <span className="font-bold text-lg">Inventory</span>
                                </div>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="mb-6 p-3 border border-slate-600/50 rounded-lg" style={{ backgroundColor: 'rgba(110, 139, 255, 0.1)' }}>
                                    <div className="text-sm font-medium">{user.email}</div>
                                    <div className="text-xs text-slate-400">{user.role}</div>
                                </div>

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
                                                onClick={closeSidebar}
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
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            <div className="hidden lg:grid lg:grid-rows-[64px_1fr] lg:grid-cols-[260px_1fr] lg:h-screen">
                <header className="col-span-2 flex items-center justify-between px-5 border-b border-slate-700/50 flex-shrink-0" style={{ backgroundColor: '#161a2f' }}>
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

                <aside className="h-full flex flex-col border-r border-slate-700/50 overflow-hidden" style={{ backgroundColor: '#161a2f' }}>
                    <div className="flex-1 p-4 overflow-y-auto">
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

                <main className="overflow-y-auto h-full">
                    <div className="p-6">
                        <div className="max-w-6xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export { DashboardLayout };