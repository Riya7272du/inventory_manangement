import React from 'react';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: string;
    supplier: string;
    sku: string;
    status: 'Low' | 'OK';
}

interface InventoryTableProps {
    items: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
    return (
        <section className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 shadow-2xl">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Item Name</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Quantity</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price/Unit</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Supplier</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SKU</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="sticky top-0 bg-slate-800/50 z-10 px-3.5 py-3 border-b border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wider sr-only">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.name}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.category}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.quantity}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.price}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.supplier}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700 text-slate-100">{item.sku}</td>
                            <td className="px-3.5 py-3 border-b border-slate-700">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border gap-1.5 ${item.status === 'Low'
                                    ? 'text-yellow-200 border-yellow-500/40 bg-yellow-500/10'
                                    : 'text-green-200 border-green-500/40 bg-green-500/10'
                                    }`}>
                                    {item.status}
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
                                    <button
                                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-500/60 text-white bg-gradient-to-b from-red-500 to-red-600 hover:brightness-105 transition-all outline outline-1 outline-blue-500/30 outline-offset-0.5"
                                        onClick={() => onDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8} className="px-3.5 py-3 text-slate-400 text-xs">
                            <div className="flex justify-between items-center gap-3">
                                <div>{items.length} of {items.length} items</div>
                                <div className="flex gap-1.5">
                                    <a className="px-3 py-2 rounded-lg border border-slate-600 text-slate-100 bg-white/5 text-decoration-none hover:bg-white/10 transition-colors" href="#">Prev</a>
                                    <a className="px-3 py-2 rounded-lg border border-blue-500/50 text-slate-100 bg-blue-500/20 text-decoration-none" href="#">1</a>
                                    <a className="px-3 py-2 rounded-lg border border-slate-600 text-slate-100 bg-white/5 text-decoration-none hover:bg-white/10 transition-colors" href="#">2</a>
                                    <a className="px-3 py-2 rounded-lg border border-slate-600 text-slate-100 bg-white/5 text-decoration-none hover:bg-white/10 transition-colors" href="#">Next</a>
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