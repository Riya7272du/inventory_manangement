import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { DashboardStats } from '../types/auth';

interface User {
    name: string;
    email: string;
    role: string;
    is_superuser?: boolean;
}

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalItems: 0,
        stockValue: 0,
        lowStockCount: 0,
        supplierCount: 0,
        categoryBreakdown: [],
        recentTransactions: [],
        monthlyData: [40, 70, 55, 85, 65, 50]
    });
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            const [reportsResponse, inventoryResponse, suppliersResponse, transactionsResponse] = await Promise.all([
                api.get('/inventory/reports/'),
                api.get('/inventory/list/'),
                api.get('/inventory/suppliers/list/'),
                api.get('/inventory/transactions/', { params: { limit: 2 } })
            ]);

            const reportsData = reportsResponse.data;
            const inventoryData = inventoryResponse.data.results || [];
            const suppliersData = suppliersResponse.data.results || [];
            const transactionsData = transactionsResponse.data.results || [];

            const lowStockItems = inventoryData.filter((item: any) => item.quantity <= 50);

            setStats({
                totalItems: reportsData.total_items,
                stockValue: reportsData.total_value || 0,
                lowStockCount: lowStockItems.length,
                supplierCount: suppliersData.length,
                categoryBreakdown: reportsData.category_breakdown || [],
                recentTransactions: transactionsData,
                monthlyData: [40, 70, 55, 85, 65, 50]
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Overview of stock, alerts, and recent activity</p>
                </div>
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-1">Dashboard</h1>
                <p className="text-slate-400 text-sm">Overview of stock, alerts, and recent activity</p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Total Items</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-100">{stats.totalItems.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">Live data</div>
                </div>
                <div className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Stock Value</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-100">${stats.stockValue.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">Current value</div>
                </div>
                <div className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Low Stock</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-100">{stats.lowStockCount}</div>
                    <div className={`text-xs mt-1 ${stats.lowStockCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {stats.lowStockCount > 0 ? 'Need attention' : 'All good'}
                    </div>
                </div>
                <div className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Suppliers</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-100">{stats.supplierCount}</div>
                    <div className="text-xs text-slate-400 mt-1">Active suppliers</div>
                </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                <div className="xl:col-span-2 p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <h3 className="text-slate-400 text-sm font-medium">Monthly Transactions</h3>
                        <button
                            onClick={() => window.location.href = '/reports'}
                            className="px-3 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 text-sm w-fit"
                        >
                            View report
                        </button>
                    </div>
                    <div className="flex items-end justify-center gap-2 sm:gap-3 h-32 sm:h-44 p-3">
                        {stats.monthlyData.map((height, index) => (
                            <div
                                key={index}
                                className="w-6 sm:w-10 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-4">Stock by Category</h3>
                    <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-4">
                        <div
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-700 flex-shrink-0"
                            style={{
                                background: stats.categoryBreakdown.length > 0
                                    ? (() => {
                                        const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
                                        let currentPercent = 0;
                                        const gradientStops = stats.categoryBreakdown.map((category, index) => {
                                            const start = currentPercent;
                                            const end = currentPercent + category.percentage;
                                            currentPercent = end;
                                            return `${colors[index % colors.length]} ${start}% ${end}%`;
                                        }).join(', ');
                                        return `conic-gradient(${gradientStops})`;
                                    })()
                                    : `conic-gradient(#374151 0% 100%)`
                            }}
                        />
                        <div className="space-y-2 text-sm w-full">
                            {stats.categoryBreakdown.length > 0 ? (
                                stats.categoryBreakdown.map((category, index) => {
                                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                                    return (
                                        <div key={category.name} className="flex items-center gap-2 sm:gap-3">
                                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colors[index % colors.length]}`} />
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 truncate">
                                                {category.name}
                                            </span>
                                            <span className="text-slate-100 ml-auto">{category.percentage}%</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-slate-400 text-sm text-center">
                                    <div>No categories found</div>
                                    <div className="text-xs mt-1">Add items with categories</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                <h3 className="text-slate-400 text-sm font-medium mb-4">Stock Alerts</h3>
                <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${stats.lowStockCount > 0
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-200'
                        : 'bg-green-500/10 border-green-500/40 text-green-200'
                        }`}>
                        {stats.lowStockCount > 0
                            ? `${stats.lowStockCount} items are low in stock`
                            : 'All items have adequate stock'
                        }
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Email notifications</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="text-xs text-slate-400">
                        Optional: enable to receive low-stock emails
                    </div>
                </div>
            </section>
            <section className="border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-slate-600/50 gap-2">
                    <h3 className="text-slate-400 text-sm font-medium">Recent Activity</h3>
                    <button
                        onClick={() => window.location.href = '/transactions'}
                        className="px-3 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 text-sm w-fit"
                    >
                        See all
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                                <th className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Item</th>
                                <th className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentTransactions.length > 0 ? (
                                stats.recentTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-slate-100 font-mono text-xs sm:text-sm">
                                            {formatTime(transaction.formatted_date)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-slate-100 text-sm">
                                            <div className="truncate max-w-[100px] sm:max-w-none" title={transaction.user_name}>
                                                {transaction.user_name}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 border-b border-slate-600/50">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-slate-600 bg-slate-700 text-slate-300">
                                                {transaction.transaction_type_display}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-slate-100 text-sm">
                                            <div className="truncate max-w-[120px] sm:max-w-none" title={transaction.item_name}>
                                                {transaction.item_name}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 border-b border-slate-600/50 text-slate-100 text-sm">
                                            <div className="truncate max-w-[150px] sm:max-w-none" title={transaction.details}>
                                                {transaction.details}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        No recent activity
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;