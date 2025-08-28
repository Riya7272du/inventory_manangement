import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Transaction } from '../types/auth';

interface PaginatedTransactionResponse {
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [pagination, setPagination] = useState({
        next: null as string | null,
        prev: null as string | null,
        current: null as string | null
    });

    const loadTransactions = async (cursor?: string | null, newFilters?: any) => {
        if (!newFilters) {
            setLoading(true);
        }

        try {
            const params: any = {};
            if (cursor) params.cursor = cursor;

            const activeFilters = newFilters || { type: typeFilter, search: searchValue };
            if (activeFilters.type) params.type = activeFilters.type;
            if (activeFilters.search) params.search = activeFilters.search;

            const response = await api.get('/inventory/transactions/', { params });
            const data: PaginatedTransactionResponse = response.data;

            setTransactions(data.results);

            const extractCursor = (url: string | null) => {
                if (!url) return null;
                try {
                    const urlObj = new URL(url);
                    const cursor = urlObj.searchParams.get('cursor');
                    return cursor || null;
                } catch (error) {
                    console.error('Error extracting cursor:', error);
                    const match = url.match(/cursor=([^&]+)/);
                    return match ? decodeURIComponent(match[1]) : null;
                }
            };


            setPagination({
                next: extractCursor(data.next),
                prev: extractCursor(data.previous),
                current: cursor || null
            });

        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadTransactions(null, { type: typeFilter, search: searchValue });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        loadTransactions(null, { type: typeFilter, search: searchValue });
    }, [typeFilter]);

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Add': return 'text-green-200 border-green-500/40 bg-green-500/10';
            case 'Update': return 'text-blue-200 border-blue-500/40 bg-blue-500/10';
            case 'Delete': return 'text-red-200 border-red-500/40 bg-red-500/10';
            default: return 'text-slate-200 border-slate-500/40 bg-slate-500/10';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-slate-100 mb-1">Transaction History</h1>
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading transactions...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">Transaction History</h1>
                    <p className="text-slate-400 text-sm">Log of additions, updates, deletions</p>
                </div>
            </div>

            <section className="border border-slate-600/50 rounded-xl p-3" style={{ backgroundColor: '#161a2f' }}>
                <div className="flex gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
                        <select
                            className="px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 focus:outline-none focus:border-blue-500"
                            style={{ backgroundColor: '#0f1221' }}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="add">Add</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Search</label>
                        <input
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                            style={{ backgroundColor: '#0f1221' }}
                            placeholder="Search items or details..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="overflow-x-auto rounded-xl border border-slate-600/50" style={{ backgroundColor: '#161a2f' }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Time</th>
                            <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>User</th>
                            <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Type</th>
                            <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Item</th>
                            <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100 font-mono text-sm">{transaction.formatted_date}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">{transaction.user_name}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-600/50">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(transaction.transaction_type_display)}`}>
                                            {transaction.transaction_type_display}
                                        </span>
                                    </td>
                                    <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">{transaction.item_name}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">{transaction.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="px-3.5 py-3 text-slate-400 text-xs">
                                <div className="flex justify-between items-center gap-3">
                                    <div>{transactions.length} transactions shown</div>
                                    <div className="flex gap-1.5">
                                        <button
                                            className={`px-3 py-2 rounded-lg border transition-colors ${pagination.prev
                                                ? 'border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10'
                                                : 'border-slate-700 text-slate-500 bg-slate-900/30 cursor-not-allowed'
                                                }`}
                                            onClick={() => pagination.prev && loadTransactions(pagination.prev)}
                                            disabled={!pagination.prev}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            className={`px-3 py-2 rounded-lg border transition-colors ${pagination.next
                                                ? 'border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10'
                                                : 'border-slate-700 text-slate-500 bg-slate-900/30 cursor-not-allowed'
                                                }`}
                                            onClick={() => pagination.next && loadTransactions(pagination.next)}
                                            disabled={!pagination.next}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </div>
    );
};

export default Transactions;



