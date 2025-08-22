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
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const canDelete = user.is_superuser || user.role === 'admin';

    if (isLoading) {
        return (
            <section className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading inventory...
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
                <div className="p-8 text-center text-slate-400">
                    No items found. Try adjusting your filters or add some inventory items.
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
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
                <tfoot>
                    <tr>
                        <td colSpan={8} className="px-3.5 py-3 text-slate-400 text-xs">
                            <div className="flex justify-between items-center gap-3">
                                <div>{items.length} items shown</div>
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
                        </td>
                    </tr>
                </tfoot>
            </table>
        </section>
    );
};

export default InventoryTable;