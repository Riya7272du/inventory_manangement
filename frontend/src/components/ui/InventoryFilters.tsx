import React from 'react';

interface InventoryFiltersProps {
    filters: {
        category: string;
        stockLevel: string;
        supplier: string;
        search: string;
    };
    onFilterChange: (filterName: string, value: string) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ filters, onFilterChange }) => {
    return (
        <section className="bg-gradient-to-b from-white/5 to-white/0 border border-slate-700 rounded-xl shadow-2xl p-3">
            <div className="grid grid-cols-12 gap-2.5">
                <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="filter-category">Category</label>
                    <select
                        id="filter-category"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Stationery">Stationery</option>
                    </select>
                </div>
                <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="filter-stock">Stock Level</label>
                    <select
                        id="filter-stock"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                        value={filters.stockLevel}
                        onChange={(e) => onFilterChange('stockLevel', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Low">Low</option>
                        <option value="OK">Adequate</option>
                    </select>
                </div>
                <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="filter-supplier">Supplier</label>
                    <select
                        id="filter-supplier"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                        value={filters.supplier}
                        onChange={(e) => onFilterChange('supplier', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Acme Co">Acme Co</option>
                        <option value="Globex">Globex</option>
                        <option value="Tech Corp">Tech Corp</option>
                    </select>
                </div>
                <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="search">Search</label>
                    <input
                        id="search"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Search by name or SKU"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
};

export default InventoryFilters;