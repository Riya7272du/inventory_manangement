import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InventoryTable from '../components/ui/InventoryTable';
import InventoryFilters from '../components/ui/InventoryFilters';
import AddItemForm from '../components/ui/AddItemForm';
import EditItemForm from '../components/ui/EditItemForm';
import DeleteModal from '../components/ui/DeleteModal';
import ImportModal from '../components/ui/ImportModal';
import { inventoryAPI } from '../services/api';
import type { InventoryItemResponse, PaginatedInventoryResponse, User } from '../types/auth';

interface Filters {
    category: string;
    stockLevel: string;
    supplier: string;
    search: string;
}

interface InventoryProps {
    user: User;
}

const Inventory: React.FC<InventoryProps> = ({ user }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItemResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<InventoryItemResponse[]>([]);
    const [pagination, setPagination] = useState({
        next: null as string | null,
        prev: null as string | null,
        current: null as string | null
    });
    const [filters, setFilters] = useState<Filters>({
        category: '',
        stockLevel: '',
        supplier: '',
        search: ''
    });

    const loadItems = async (cursor?: string | null, newFilters?: Filters) => {
        setLoading(true);
        try {
            const params: any = {};
            if (cursor) params.cursor = cursor;

            const activeFilters = newFilters || filters;
            if (activeFilters.category) params.category = activeFilters.category;
            if (activeFilters.supplier) params.supplier = activeFilters.supplier;
            if (activeFilters.search) params.search = activeFilters.search;

            const response = await inventoryAPI.getItems(params);
            const data: PaginatedInventoryResponse = response.data;
            let itemList = data.results;

            if (activeFilters.stockLevel) {
                itemList = itemList.filter(item => {
                    const status = item.quantity <= 50 ? 'Low' : 'OK';
                    return status === activeFilters.stockLevel;
                });
            }

            setItems(itemList);

            const extractCursor = (url: string | null) => {
                if (!url) return null;
                const match = url.match(/cursor=([^&]+)/);
                return match ? match[1] : null;
            };

            setPagination({
                next: extractCursor(data.next),
                prev: extractCursor(data.previous),
                current: cursor || null
            });

        } catch (error: any) {
            console.error('Error loading items:', error);
            if (error.response?.data?.detail === 'Invalid cursor') {
                console.log('Invalid cursor detected, reloading without cursor');
                if (cursor) {
                    loadItems(null, newFilters);
                    return;
                }
            }
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination({ next: null, prev: null, current: null });
            loadItems(null, filters);
        }, 300);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        if (filters.category || filters.supplier || filters.stockLevel) {
            setPagination({ next: null, prev: null, current: null });
            loadItems(null, filters);
        }
    }, [filters.category, filters.supplier, filters.stockLevel]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (item: InventoryItemResponse) => {
        setSelectedItem(item);
        setShowEditForm(true);
    };

    const handleDelete = (id: number) => {
        const item = items.find(item => item.id === id);
        setSelectedItem(item || null);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;

        try {
            await inventoryAPI.deleteItem(selectedItem.id);
            toast.success('Item deleted!');
            loadItems(pagination.current);
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error('Not allowed to delete items');
            } else {
                toast.error('Failed to delete item');
            }
        } finally {
            setShowDeleteModal(false);
            setSelectedItem(null);
        }
    };

    const handleImport = (file: File) => {
        console.log('Import file:', file);
        toast.info('CSV import coming soon!');
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setErrorMessage('');
        loadItems(pagination.current);
    };

    const handleEditSuccess = () => {
        setShowEditForm(false);
        setSelectedItem(null);
        setErrorMessage('');
        loadItems(pagination.current);
    };

    const handleError = (message: string) => {
        setErrorMessage(message);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedItem(null);
        setErrorMessage('');
    };

    if (showAddForm) {
        return (
            <div className="h-full flex flex-col">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                )}
                <AddItemForm
                    onCancel={handleCancel}
                    onSuccess={handleAddSuccess}
                    onError={handleError}
                />
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            </div>
        );
    }

    if (showEditForm && selectedItem) {
        return (
            <div className="h-full flex flex-col">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                )}
                <EditItemForm
                    item={selectedItem}
                    onCancel={handleCancel}
                    onSuccess={handleEditSuccess}
                    onError={handleError}
                />
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
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
                    <p className="text-slate-400 text-sm">Manage your inventory items</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                        onClick={() => setShowImportModal(true)}
                    >
                        Import CSV
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
                user={user}
                isLoading={loading}
                onNextPage={() => pagination.next && loadItems(pagination.next)}
                onPrevPage={() => pagination.prev && loadItems(pagination.prev)}
                hasNext={!!pagination.next}
                hasPrev={!!pagination.prev}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedItem?.item_name}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
            />

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
};

export default Inventory;