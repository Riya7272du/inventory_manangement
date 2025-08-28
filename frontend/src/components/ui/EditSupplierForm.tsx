import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supplierAPI } from '../../services/api';
import { validateName, validatePhone, validateEmail } from '../../utils/validation';
import type { Supplier } from '../../types/auth';

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

interface EditSupplierFormProps {
    supplier: Supplier;
    onCancel: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const EditSupplierForm: React.FC<EditSupplierFormProps> = ({ supplier, onCancel, onSuccess, onError }) => {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (supplier) {
            setForm({
                name: supplier.name || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || ''
            });
            setErrors({});
        }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const nameError = validateName(form.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(form.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhone(form.phone);
        if (phoneError) newErrors.phone = phoneError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const data: Partial<Supplier> = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                address: form.address.trim() || undefined
            };

            const response = await supplierAPI.updateSupplier(supplier.id!, data);

            if (response.status === 200) {
                toast.success('Supplier updated successfully!');
                setTimeout(onSuccess, 1000);
            }
        } catch (error: any) {
            console.error('Update supplier error:', error);

            if (error.response?.data?.details) {
                const details = error.response.data.details;

                if (typeof details === 'object') {
                    const backendErrors: FormErrors = {};

                    if (details.name?.[0]) backendErrors.name = details.name[0];
                    if (details.email?.[0]) backendErrors.email = details.email[0];
                    if (details.phone?.[0]) backendErrors.phone = details.phone[0];
                    if (details.address?.[0]) backendErrors.address = details.address[0];

                    setErrors(backendErrors);
                } else {
                    onError(details);
                }
            } else if (error.response?.status === 400) {
                onError('Please check your input and try again');
            } else {
                onError('Something went wrong. Please try again.');
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
                        Edit Supplier
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Update "{supplier.name}"
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                    Back
                </button>
            </div>

            <div className="border border-slate-600/50 rounded-xl p-5 flex-1" style={{ backgroundColor: '#161a2f' }}>
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Supplier Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.name
                                    ? 'border border-red-500 focus:border-red-500 bg-red-900/20'
                                    : 'border border-slate-600/50 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                                placeholder="Enter supplier name"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.email
                                    ? 'border border-red-500 focus:border-red-500 bg-red-900/20'
                                    : 'border border-slate-600/50 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                                placeholder="supplier@company.com"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none disabled:opacity-50 transition-colors ${errors.phone
                                    ? 'border border-red-500 focus:border-red-500 bg-red-900/20'
                                    : 'border border-slate-600/50 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                                placeholder=""
                            />
                            {errors.phone && (
                                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter full address (optional)"
                                disabled={submitting}
                                className={`w-full px-3 py-2 rounded-lg text-slate-100 focus:outline-none resize-none disabled:opacity-50 transition-colors ${errors.address
                                    ? 'border border-red-500 focus:border-red-500 bg-red-900/20'
                                    : 'border border-slate-600/50 focus:border-blue-500 bg-slate-900/60'
                                    }`}
                            />
                            {errors.address && (
                                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-600/50">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Supplier'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSupplierForm;