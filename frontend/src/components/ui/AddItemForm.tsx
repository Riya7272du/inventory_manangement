import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inventoryAPI, supplierAPI } from '../../services/api';
import {
    validateItemName,
    validateCategory,
    validateQuantity,
    validatePrice,
    validateSupplier,
    validateSKU
} from '../../utils/validation';
import type { InventoryItem, Supplier, FormData, FormErrors } from '../../types/auth';

interface AddItemFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onCancel, onSuccess, onError }) => {
    const [submitting, setSubmitting] = useState(false);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
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

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                const nameResult = validateItemName(value);
                return nameResult.isValid ? undefined : nameResult.error;
            case 'category':
                const categoryResult = validateCategory(value);
                return categoryResult.isValid ? undefined : categoryResult.error;
            case 'quantity':
                const quantityResult = validateQuantity(value);
                return quantityResult.isValid ? undefined : quantityResult.error;
            case 'price':
                const priceResult = validatePrice(value);
                return priceResult.isValid ? undefined : priceResult.error;
            case 'supplier':
                const supplierResult = validateSupplier(value);
                return supplierResult.isValid ? undefined : supplierResult.error;
            case 'sku':
                const skuResult = validateSKU(value);
                return skuResult.isValid ? undefined : skuResult.error;
            default:
                return undefined;
        }
    };

    const validateAllFields = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(form).forEach(fieldName => {
            const error = validateField(fieldName, form[fieldName as keyof FormData]);
            if (error) {
                newErrors[fieldName as keyof FormErrors] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        if (errors.general) {
            setErrors(prev => ({ ...prev, general: undefined }));
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const resetForm = () => {
        setForm({
            name: '',
            category: '',
            quantity: '',
            price: '',
            supplier: '',
            sku: '',
            description: ''
        });
        setErrors({});
        setTouched({});
        setSuccessMessage('');
    };

    const isFormValid = (): boolean => {
        const hasFieldErrors = Object.keys(errors).some(key =>
            key !== 'general' && errors[key as keyof FormErrors] !== undefined
        );

        const requiredFieldsFilled = form.name.trim() !== '' &&
            form.quantity.trim() !== '' &&
            form.sku.trim() !== '';

        return !hasFieldErrors && requiredFieldsFilled;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched: { [key: string]: boolean } = {};
        Object.keys(form).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);
        if (!validateAllFields()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setSubmitting(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const data: InventoryItem = {
                sku: form.sku,
                item_name: form.name,
                quantity: Number(form.quantity),
                price: form.price || '0',
                category: form.category || undefined,
                supplier: form.supplier ? Number(form.supplier) : undefined,
                description: form.description || undefined
            };

            const response = await inventoryAPI.addItem(data);
            if (response.status === 201) {
                setSuccessMessage('Item added successfully!');
                toast.success('Item added successfully!');
                resetForm();
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }

        } catch (error: any) {
            console.error('Add item error:', error);
            if (error.response?.status === 400) {
                if (error.response.data?.details) {
                    const details = error.response.data.details;

                    if (typeof details === 'object') {
                        const fieldErrors: FormErrors = {};
                        if (details.item_name) fieldErrors.name = Array.isArray(details.item_name) ? details.item_name[0] : details.item_name;
                        if (details.sku) fieldErrors.sku = Array.isArray(details.sku) ? details.sku[0] : details.sku;
                        if (details.quantity) fieldErrors.quantity = Array.isArray(details.quantity) ? details.quantity[0] : details.quantity;
                        if (details.price) fieldErrors.price = Array.isArray(details.price) ? details.price[0] : details.price;
                        if (details.category) fieldErrors.category = Array.isArray(details.category) ? details.category[0] : details.category;
                        if (details.supplier) fieldErrors.supplier = Array.isArray(details.supplier) ? details.supplier[0] : details.supplier;
                        if (details.description) fieldErrors.description = Array.isArray(details.description) ? details.description[0] : details.description;

                        setErrors(fieldErrors);
                    } else {
                        setErrors({ general: details });
                    }
                } else if (error.response.data?.error) {
                    setErrors({ general: error.response.data.error });
                } else {
                    setErrors({ general: 'Please check your input and try again' });
                }
            }
            else if (error.response?.status === 500) {
                setErrors({ general: 'Something went wrong. Please try again.' });
                toast.error('Server error. Please try again.');
            }
            else if (!error.response) {
                setErrors({ general: 'Network error. Please check your connection and try again.' });
                toast.error('Network error. Please try again.');
            }
            else {
                setErrors({ general: 'Something went wrong. Please try again.' });
                toast.error('Something went wrong. Please try again.');
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
            {successMessage && (
                <div className="mb-4 p-3 bg-green-600/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
            )}

            {errors.general && (
                <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
            )}

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
                                onBlur={handleBlur}
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.name
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.name && !errors.name
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
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
                                onBlur={handleBlur}
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.sku
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.sku && !errors.sku
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.sku ? (
                                <p className="text-red-400 text-sm mt-1">{errors.sku}</p>
                            ) : (
                                <p className="text-slate-400 text-xs mt-1">Must be unique (letters, numbers, dashes, underscores)</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.category
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.category && !errors.category
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            >
                                <option value="">Select Category (Optional)</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Stationery">Stationery</option>
                            </select>
                            {errors.category && (
                                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                            )}
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
                                onBlur={handleBlur}
                                min="0"
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.quantity
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.quantity && !errors.quantity
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.quantity ? (
                                <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
                            ) : (
                                <p className="text-slate-400 text-xs mt-1">Must be 0 or greater (whole numbers only)</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                step="0.01"
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.price
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.price && !errors.price
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.price ? (
                                <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                            ) : (
                                <p className="text-slate-400 text-xs mt-1">Optional (must be 0 or greater, max 2 decimal places)</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Supplier
                            </label>
                            <select
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={submitting || loadingSuppliers}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.supplier
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.supplier && !errors.supplier
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            >
                                <option value="">Select Supplier (Optional)</option>
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
                            {errors.supplier && (
                                <p className="text-red-400 text-sm mt-1">{errors.supplier}</p>
                            )}
                            {!loadingSuppliers && suppliers.length === 0 && (
                                <p className="text-slate-400 text-xs mt-1">Add suppliers first to assign them to items</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={3}
                                placeholder="Optional description"
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none resize-none disabled:opacity-50 transition-colors ${errors.description
                                    ? 'border-2 border-red-500 focus:border-red-500 bg-red-900/20'
                                    : touched.description && !errors.description
                                        ? 'border-2 border-green-500 focus:border-green-500 bg-slate-900/60'
                                        : 'border border-slate-600 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
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
                            disabled={submitting || loadingSuppliers || !isFormValid()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Submitting...
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