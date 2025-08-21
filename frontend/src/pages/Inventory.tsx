import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryTable from '../components/ui/InventoryTable';
import InventoryFilters from '../components/ui/InventoryFilters';
import AddItemForm from '../components/ui/AddItemForm';
import DeleteModal from '../components/ui/DeleteModal';
import ImportModal from '../components/ui/ImportModal';

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

interface Filters {
    category: string;
    stockLevel: string;
    supplier: string;
    search: string;
}

const Inventory: React.FC = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState<Filters>({
        category: '',
        stockLevel: '',
        supplier: '',
        search: ''
    });

    const [items, setItems] = useState<InventoryItem[]>([
        {
            id: '1',
            name: 'Laptop',
            category: 'Electronics',
            quantity: 4,
            price: '$5.00',
            supplier: 'Acme Co',
            sku: 'SKU1',
            status: 'Low'
        },
        {
            id: '2',
            name: 'Laptop',
            category: 'Electronics',
            quantity: 6,
            price: '$2.80',
            supplier: 'Globex',
            sku: 'SKU2',
            status: 'OK'
        }
    ]);

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleEdit = (item: InventoryItem) => {
        console.log('Edit item:', item);
    };

    const handleDelete = (id: string) => {
        const item = items.find(item => item.id === id);
        setSelectedItem(item || null);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            setItems(prev => prev.filter(item => item.id !== selectedItem.id));
            toast.success('Item deleted successfully!');
        }
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const handleImport = (file: File) => {
        console.log('Import file:', file);
        toast.success('CSV import functionality to be implemented!');
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setErrorMessage('');

    };

    const handleAddError = (message: string) => {
        setErrorMessage(message);
    };

    const handleAddCancel = () => {
        setShowAddForm(false);
        setErrorMessage('');
    };

    const filteredItems = items.filter(item => {
        if (filters.category && item.category !== filters.category) return false;
        if (filters.stockLevel && item.status !== filters.stockLevel) return false;
        if (filters.supplier && item.supplier !== filters.supplier) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return item.name.toLowerCase().includes(searchLower) ||
                item.sku.toLowerCase().includes(searchLower);
        }
        return true;
    });

    if (showAddForm) {
        return (
            <div className="h-full flex flex-col">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                )}
                <AddItemForm
                    onCancel={handleAddCancel}
                    onSuccess={handleAddSuccess}
                    onError={handleAddError}
                />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="dark"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">
                        Inventory Management
                    </h1>
                    <p className="text-slate-400 text-sm">View, search, filter, and manage items</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                        onClick={() => setShowImportModal(true)}
                    >
                        Import CSV
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Add Item
                    </button>
                </div>
            </div>

            <InventoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <InventoryTable
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedItem?.name}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
            />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
            />
        </div>
    );
};

export default Inventory;