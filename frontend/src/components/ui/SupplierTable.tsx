import React from 'react';
import type { Supplier, User } from '../../types/auth';

interface SupplierTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (id: number) => void;
    user: User;
    isLoading?: boolean;
    onNextPage?: () => void;
    onPrevPage?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
    suppliers,
    onEdit,
    onDelete,
    user,
    isLoading = false,
    onNextPage,
    onPrevPage,
    hasNext = false,
    hasPrev = false
}) => {
    const canDelete = user.is_superuser || user.role === 'admin';

    if (isLoading) {
        return (
            <section className="overflow-x-auto rounded-xl border border-slate-600/50" style={{ backgroundColor: '#161a2f' }}>
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading suppliers...
                </div>
            </section>
        );
    }

    if (suppliers.length === 0) {
        return (
            <section className="overflow-x-auto rounded-xl border border-slate-600/50" style={{ backgroundColor: '#161a2f' }}>
                <div className="p-8 text-center text-slate-400">
                    No suppliers found. Try adjusting your search or add some suppliers.
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-x-auto rounded-xl border border-slate-600/50" style={{ backgroundColor: '#161a2f' }}>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Name</th>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Email</th>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Phone</th>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Address</th>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Linked Items</th>
                        <th className="sticky top-0 z-10 px-3.5 py-3 border-b border-slate-600/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider" style={{ backgroundColor: '#161a2f' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100 font-medium">{supplier.name}</td>
                            <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">{supplier.email || '-'}</td>
                            <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">{supplier.phone || '-'}</td>
                            <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100 max-w-48 truncate">{supplier.address || '-'}</td>
                            <td className="px-3.5 py-3 border-b border-slate-600/50 text-slate-100">
                                {supplier.linked_items || 0}
                            </td>
                            <td className="px-3.5 py-3 border-b border-slate-600/50">
                                <div className="flex items-center gap-2.5">
                                    <button
                                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10 transition-all"
                                        onClick={() => onEdit(supplier)}
                                    >
                                        Edit
                                    </button>
                                    {canDelete && (
                                        <button
                                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-500/60 text-white bg-gradient-to-b from-red-500 to-red-600 hover:brightness-105 transition-all"
                                            onClick={() => onDelete(supplier.id!)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} className="px-3.5 py-3 text-slate-400 text-xs">
                            <div className="flex justify-between items-center gap-3">
                                <div>{suppliers.length} suppliers shown</div>
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

export default SupplierTable;