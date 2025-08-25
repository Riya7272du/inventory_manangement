import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ReportsData {
    total_value: number;
    category_values: {
        electronics: number;
        stationery: number;
        apparel: number;
    };
    category_breakdown: Array<{
        name: string;
        count: number;
        percentage: number;
    }>;
}

const Reports: React.FC = () => {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReportsData = async () => {
            try {
                const response = await api.get('/inventory/reports/');
                setData(response.data);
            } catch (error) {
                console.error('Error loading reports data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadReportsData();
    }, []);

    const handleExportCSV = async () => {
        try {
            const response = await api.get('/inventory/reports/export-csv/', {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('CSV export failed:', error);
            alert('CSV export failed. Please try again.');
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await api.get('/inventory/reports/export-pdf/', {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-slate-100 mb-1">Reports</h1>
                <div className="p-8 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    Loading reports...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">Reports</h1>
                    <p className="text-slate-400 text-sm">Stock value, monthly transactions, and exports</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
                    >
                        Export PDF
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-6 p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-3">Current Stock Value</h3>
                    <div className="text-3xl font-bold text-slate-100 mb-4">
                        ${data?.total_value?.toLocaleString() || '0'}
                    </div>
                    <div className="h-px bg-slate-600 my-4"></div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-300">Electronics</span>
                            <span className="text-slate-100">${data?.category_values?.electronics?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Stationery</span>
                            <span className="text-slate-100">${data?.category_values?.stationery?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Apparel</span>
                            <span className="text-slate-100">${data?.category_values?.apparel?.toLocaleString() || '0'}</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-6 p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <h3 className="text-slate-400 text-sm font-medium mb-4">Category Breakdown</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-700"
                            style={{
                                background: data?.category_breakdown && data.category_breakdown.length > 0
                                    ? `conic-gradient(
                                        #6366f1 0% ${data.category_breakdown[0]?.percentage || 0}%, 
                                        #22c55e ${data.category_breakdown[0]?.percentage || 0}% ${(data.category_breakdown[0]?.percentage || 0) + (data.category_breakdown[1]?.percentage || 0)}%, 
                                        #f59e0b ${(data.category_breakdown[0]?.percentage || 0) + (data.category_breakdown[1]?.percentage || 0)}% 100%
                                    )`
                                    : `conic-gradient(#6366f1 0% 100%)`
                            }}>
                        </div>
                        <div className="space-y-2 text-sm">
                            {data?.category_breakdown && data.category_breakdown.length > 0 ? (
                                data.category_breakdown.map((category, index) => (
                                    <div key={category.name} className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-500' :
                                            index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                                            {category.name}
                                        </span>
                                        <span className="text-slate-100">{category.percentage}%</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-sm">
                                    <div>No categories found</div>
                                    <div className="text-xs mt-1">Add items with categories</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 p-4 border border-slate-600/50 rounded-xl" style={{ backgroundColor: '#161a2f' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-400 text-sm font-medium">Monthly Transactions</h3>
                        <select
                            className="px-3 py-2 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                            style={{ backgroundColor: '#0f1221' }}
                        >
                            <option>Last 6 months</option>
                            <option>Last 12 months</option>
                            <option>This year</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-center gap-4 h-40 p-4">
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '50%' }}></div>
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '65%' }}></div>
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '40%' }}></div>
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '80%' }}></div>
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '55%' }}></div>
                        <div className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '70%' }}></div>
                    </div>
                    <div className="text-center text-slate-500 text-xs mt-2">
                        Transaction activity over the last 6 months
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;