import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SupplierTable from '../components/ui/SupplierTable';
import SupplierFilters from '../components/ui/SupplierFilters';
import AddSupplierForm from '../components/ui/AddSupplierForm';
import EditSupplierForm from '../components/ui/EditSupplierForm';
import DeleteModal from '../components/ui/DeleteModal';
import { supplierAPI } from '../services/api';
import type { Supplier, PaginatedSuppliersResponse, User } from '../types/auth';

interface SuppliersProps {
    user: User;
}

const Suppliers: React.FC<SuppliersProps> = ({ user }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        next: null as string | null,
        prev: null as string | null,
        current: null as string | null
    });

    const loadSuppliers = async (cursor?: string | null, searchQuery?: string) => {
        setLoading(true);
        try {
            const params: any = {};
            if (cursor) params.cursor = cursor;
            if (searchQuery) params.search = searchQuery;

            const response = await supplierAPI.getSuppliers(params);
            const data: PaginatedSuppliersResponse = response.data;

            setSuppliers(data.results);

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
            console.error('Error loading suppliers:', error);
            toast.error('Failed to load suppliers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSuppliers(null, searchValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowEditForm(true);
    };

    const handleDelete = (id: number) => {
        const supplier = suppliers.find(supplier => supplier.id === id);
        setSelectedSupplier(supplier || null);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedSupplier) return;

        try {
            await supplierAPI.deleteSupplier(selectedSupplier.id!);
            toast.success('Supplier deleted successfully!');
            loadSuppliers(pagination.current, searchValue);
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error('Not allowed to delete suppliers');
            } else {
                toast.error('Failed to delete supplier');
            }
        } finally {
            setShowDeleteModal(false);
            setSelectedSupplier(null);
        }
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setErrorMessage('');
        loadSuppliers(pagination.current, searchValue);
    };

    const handleEditSuccess = () => {
        setShowEditForm(false);
        setSelectedSupplier(null);
        setErrorMessage('');
        loadSuppliers(pagination.current, searchValue);
    };

    const handleError = (message: string) => {
        setErrorMessage(message);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedSupplier(null);
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
                <AddSupplierForm
                    onCancel={handleCancel}
                    onSuccess={handleAddSuccess}
                    onError={handleError}
                />
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            </div>
        );
    }

    if (showEditForm && selectedSupplier) {
        return (
            <div className="h-full flex flex-col">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                )}
                <EditSupplierForm
                    supplier={selectedSupplier}
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
                        Suppliers
                    </h1>
                    <p className="text-slate-400 text-sm">Manage supplier records and link to items</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Supplier
                    </button>
                </div>
            </div>

            <SupplierFilters
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
            />

            <SupplierTable
                suppliers={suppliers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                user={user}
                isLoading={loading}
                onNextPage={() => pagination.next && loadSuppliers(pagination.next, searchValue)}
                onPrevPage={() => pagination.prev && loadSuppliers(pagination.prev, searchValue)}
                hasNext={!!pagination.next}
                hasPrev={!!pagination.prev}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedSupplier?.name}
            />

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
};

export default Suppliers;