import React from 'react';

interface SupplierFiltersProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({ searchValue, onSearchChange }) => {
    return (
        <section className="border border-slate-600/50 rounded-xl p-3" style={{ backgroundColor: '#161a2f' }}>
            <div className="flex gap-2.5">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="supplier-search">
                        Search
                    </label>
                    <input
                        id="supplier-search"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        style={{ backgroundColor: '#0f1221' }}
                        placeholder="Search by supplier name"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
};

export default SupplierFilters;