import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { inventoryAPI } from '../../services/api';
import type { InventoryItemResponse, InventoryItemUpdate } from '../../types/auth';

interface FormData {
    item_name: string;
    category: string;
    quantity: string;
    price: string;
    supplier: string;
    sku: string;
}

interface EditItemFormProps {
    item: InventoryItemResponse;
    onCancel: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item, onCancel, onSuccess, onError }) => {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<FormData>({
        item_name: '',
        category: '',
        quantity: '',
        price: '',
        supplier: '',
        sku: ''
    });

    useEffect(() => {
        if (item) {
            setForm({
                item_name: item.item_name,
                category: item.category || '',
                quantity: item.quantity.toString(),
                price: item.price,
                supplier: item.supplier || '',
                sku: item.sku
            });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data: InventoryItemUpdate = {
                sku: form.sku,
                item_name: form.item_name,
                quantity: Number(form.quantity),
                price: form.price,
                category: form.category || null,
                supplier: form.supplier || null
            };

            const response = await inventoryAPI.updateItem(item.id, data);

            if (response.status === 200) {
                toast.success('Item updated!');
                setTimeout(onSuccess, 1000);
            }
        } catch (error: any) {
            console.error('Update error:', error);

            if (error.response?.data?.details) {
                const details = error.response.data.details;
                if (typeof details === 'object') {
                    const firstError = Object.values(details)[0] as string[];
                    onError(firstError[0] || 'Please check your input');
                } else {
                    onError(details);
                }
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
                        Edit Item
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Update "{item.item_name}"
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
                                name="item_name"
                                value={form.item_name}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
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

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
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
                                Supplier
                            </label>
                            <select
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                disabled={submitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="">Select Supplier</option>
                                <option value="Tech Corp">Tech Corp</option>
                                <option value="Acme Co">Acme Co</option>
                                <option value="Globex">Globex</option>
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
                                min="0"
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
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Item'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemForm;