import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inventoryAPI, supplierAPI } from '../../services/api';
import type { InventoryItem, Supplier } from '../../types/auth';

interface FormData {
    name: string;
    category: string;
    quantity: string;
    price: string;
    supplier: string;
    sku: string;
    description: string;
}

interface AddItemFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onCancel, onSuccess, onError }) => {
    const [submitting, setSubmitting] = useState(false);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [form, setForm] = useState<FormData>({
        name: '',
        category: '',
        quantity: '',
        price: '',
        supplier: '',
        sku: '',
        description: ''
    });

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const response = await supplierAPI.getSuppliers();
                setSuppliers(response.data.results || []);
            } catch (error) {
                console.error('Failed to load suppliers:', error);
                toast.error('Failed to load suppliers');
            } finally {
                setLoadingSuppliers(false);
            }
        };

        loadSuppliers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data: InventoryItem = {
                sku: form.sku,
                item_name: form.name,
                quantity: Number(form.quantity),
                price: form.price,
                category: form.category,
                supplier: form.supplier ? Number(form.supplier) : undefined,
                description: form.description || undefined
            };

            const response = await inventoryAPI.addItem(data);

            if (response.status === 201) {
                toast.success('Item added!');
                setTimeout(onSuccess, 1000);
            }
        } catch (error: any) {
            console.error('Add item error:', error);

            if (error.response?.data?.message) {
                onError(error.response.data.message);
            } else if (error.response?.status === 400) {
                onError('Please check your input');
            } else {
                onError('Something went wrong');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">
                        Add New Item
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Fill in the details to add inventory
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                >
                    Back
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex-1">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Item Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Supplier
                            </label>
                            <select
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                disabled={submitting || loadingSuppliers}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="">Select Supplier</option>
                                {loadingSuppliers ? (
                                    <option value="">Loading suppliers...</option>
                                ) : suppliers.length === 0 ? (
                                    <option value="">No suppliers available</option>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {!loadingSuppliers && suppliers.length === 0 && (
                                <p className="text-slate-400 text-xs mt-1">Add suppliers first to assign them to items</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                            <p className="text-slate-400 text-xs mt-1">Must be unique</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Optional description"
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loadingSuppliers}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Item'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
};

export default AddItemForm;