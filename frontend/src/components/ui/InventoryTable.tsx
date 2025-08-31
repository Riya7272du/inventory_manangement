import React from 'react';
import type { InventoryItemResponse, User } from '../../types/auth';

interface InventoryTableProps {
    items: InventoryItemResponse[];
    onEdit: (item: InventoryItemResponse) => void;
    onDelete: (id: number) => void;
    user: User;
    isLoading?: boolean;
    onNextPage?: () => void;
    onPrevPage?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
    items,
    onEdit,
    onDelete,
    user,
    isLoading = false,
    onNextPage,
    onPrevPage,
    hasNext = false,
    hasPrev = false
}) => {
    const getStockStatus = (quantity: number): 'Low' | 'OK' => {
        return quantity <= 50 ? 'Low' : 'OK';
    };

    const formatPrice = (price: string): string => {
        return `₹${parseFloat(price).toFixed(2)}`;
    };

    const canDelete = user.is_superuser || user.role === 'admin';

    if (isLoading) {
        return (
            <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading inventory...
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
                <div className="p-8 text-center text-slate-400">
                    No items found. Try adjusting your filters or add some inventory items.
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
            <div className="block lg:hidden">
                <div className="divide-y divide-slate-700">
                    {items.map((item) => {
                        const status = getStockStatus(item.quantity);
                        return (
                            <div key={item.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-100 truncate">{item.item_name}</h3>
                                        <p className="text-sm text-slate-400 font-mono">{item.sku}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ml-3 ${status === 'Low'
                                        ? 'text-yellow-200 border-yellow-500/40 bg-yellow-500/10'
                                        : 'text-green-200 border-green-500/40 bg-green-500/10'
                                        }`}>
                                        {status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                    <div>
                                        <span className="text-slate-400">Category:</span>
                                        <span className="text-slate-100 ml-2">{item.category || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Quantity:</span>
                                        <span className="text-slate-100 ml-2">{item.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Price:</span>
                                        <span className="text-slate-100 ml-2">{formatPrice(item.price)}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Supplier:</span>
                                        <span className="text-slate-100 ml-2">{item.supplier || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10 transition-all text-sm"
                                        onClick={() => onEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    {canDelete && (
                                        <button
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/60 text-white bg-gradient-to-b from-red-500 to-red-600 hover:brightness-105 transition-all text-sm"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Item Name</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SKU</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Quantity</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Supplier</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const status = getStockStatus(item.quantity);
                            return (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.item_name}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100 font-mono text-sm">{item.sku}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.category || '-'}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.quantity}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{formatPrice(item.price)}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.supplier || '-'}</td>
                                    <td className="px-3.5 py-3 border-b border-slate-700">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border gap-1.5 ${status === 'Low'
                                            ? 'text-yellow-200 border-yellow-500/40 bg-yellow-500/10'
                                            : 'text-green-200 border-green-500/40 bg-green-500/10'
                                            }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-3.5 py-3 border-b border-slate-700">
                                        <div className="flex items-center gap-2.5">
                                            <button
                                                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10 transition-all"
                                                onClick={() => onEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            {canDelete && (
                                                <button
                                                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-500/60 text-white bg-gradient-to-b from-red-500 to-red-600 hover:brightness-105 transition-all"
                                                    onClick={() => onDelete(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-3 text-slate-400 text-xs border-t border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-center sm:text-left">{items.length} items shown</div>
                    <div className="flex gap-1.5">
                        <button
                            className={`px-3 py-2 rounded-lg border transition-colors ${hasPrev
                                ? 'border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10'
                                : 'border-slate-700 text-slate-500 bg-slate-900/30 cursor-not-allowed'
                                }`}
                            onClick={onPrevPage}
                            disabled={!hasPrev}
                        >
                            Prev
                        </button>
                        <button
                            className={`px-3 py-2 rounded-lg border transition-colors ${hasNext
                                ? 'border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10'
                                : 'border-slate-700 text-slate-500 bg-slate-900/30 cursor-not-allowed'
                                }`}
                            onClick={onNextPage}
                            disabled={!hasNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InventoryTable;