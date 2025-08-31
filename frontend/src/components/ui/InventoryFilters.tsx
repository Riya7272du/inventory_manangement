import React, { useState, useEffect } from 'react';
import { supplierAPI } from '../../services/api';
import type { Supplier } from '../../types/auth';

interface Filters {
    category: string;
    stockLevel: string;
    supplier: string;
    search: string;
}

interface InventoryFiltersProps {
    filters: Filters;
    onFilterChange: (filterName: string, value: string) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ filters, onFilterChange }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const response = await supplierAPI.getSuppliers();
                setSuppliers(response.data.results || []);
            } catch (error) {
                console.error('Failed to load suppliers:', error);
            } finally {
                setLoadingSuppliers(false);
            }
        };

        loadSuppliers();
    }, []);

    return (
        <section className="bg-white/5 border border-slate-700 rounded-xl p-3 sm:p-4">
            <div className="block lg:hidden">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-300">Filters</h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-slate-700/30 transition-colors text-slate-400"
                        aria-label={isExpanded ? "Hide filters" : "Show filters"}
                    >
                        <svg
                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <div className="mb-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="mobile-search">Search</label>
                    <input
                        id="mobile-search"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        placeholder="Search by name or SKU"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {isExpanded && (
                    <div className="space-y-3 border-t border-slate-700/50 pt-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="mobile-category">Category</label>
                            <select
                                id="mobile-category"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500"
                                value={filters.category}
                                onChange={(e) => onFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="mobile-stock">Stock Level</label>
                            <select
                                id="mobile-stock"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500"
                                value={filters.stockLevel}
                                onChange={(e) => onFilterChange('stockLevel', e.target.value)}
                            >
                                <option value="">All Levels</option>
                                <option value="Low">Low Stock</option>
                                <option value="OK">Adequate Stock</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="mobile-supplier">Supplier</label>
                            <select
                                id="mobile-supplier"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                value={filters.supplier}
                                onChange={(e) => onFilterChange('supplier', e.target.value)}
                                disabled={loadingSuppliers}
                            >
                                <option value="">All Suppliers</option>
                                {loadingSuppliers ? (
                                    <option value="">Loading...</option>
                                ) : suppliers.length === 0 ? (
                                    <option value="">No suppliers</option>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.name}>
                                            {supplier.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden lg:block">
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="desktop-category">Category</label>
                        <select
                            id="desktop-category"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500"
                            value={filters.category}
                            onChange={(e) => onFilterChange('category', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Stationery">Stationery</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="desktop-stock">Stock Level</label>
                        <select
                            id="desktop-stock"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500"
                            value={filters.stockLevel}
                            onChange={(e) => onFilterChange('stockLevel', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Low">Low</option>
                            <option value="OK">Adequate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="desktop-supplier">Supplier</label>
                        <select
                            id="desktop-supplier"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            value={filters.supplier}
                            onChange={(e) => onFilterChange('supplier', e.target.value)}
                            disabled={loadingSuppliers}
                        >
                            <option value="">All</option>
                            {loadingSuppliers ? (
                                <option value="">Loading...</option>
                            ) : suppliers.length === 0 ? (
                                <option value="">No suppliers</option>
                            ) : (
                                suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.name}>
                                        {supplier.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="desktop-search">Search</label>
                        <input
                            id="desktop-search"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                            placeholder="Search by name or SKU"
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default InventoryFilters;