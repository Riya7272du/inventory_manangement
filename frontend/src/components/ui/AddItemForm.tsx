import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inventoryAPI } from '../../services/api';
import type { InventoryItem } from '../../types/auth';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: '',
        quantity: '',
        price: '',
        supplier: '',
        sku: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const itemData: InventoryItem = {
                sku: formData.sku,
                item_name: formData.name,
                quantity: Number(formData.quantity),
                price: formData.price,
                category: formData.category,
                supplier: formData.supplier,
                description: formData.description || undefined
            };

            const response = await inventoryAPI.addItem(itemData);

            if (response.status === 201) {
                toast.success('Item added successfully!');
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (error: any) {
            console.error('Error adding item:', error);

            if (error.response?.data?.message) {
                onError(error.response.data.message);
            } else if (error.response?.status === 400) {
                onError('Please check your input and try again.');
            } else {
                onError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
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
                        Fill in the details below to add a new inventory item
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
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
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
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
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                required
                                disabled={isSubmitting}
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
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0.01"
                                step="0.01"
                                required
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Supplier *
                            </label>
                            <select
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
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
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
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
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Optional description"
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
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

export default AddItemForm;