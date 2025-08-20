import React, { useState } from 'react';

const Inventory: React.FC = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        supplier: '',
        sku: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would make API call to save the item
        console.log('Saving item:', formData);
        setShowAddForm(false);
        setFormData({
            name: '',
            category: '',
            quantity: 0,
            price: 0,
            supplier: '',
            sku: '',
            description: ''
        });
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setFormData({
            name: '',
            category: '',
            quantity: 0,
            price: 0,
            supplier: '',
            sku: '',
            description: ''
        });
    };

    if (showAddForm) {
        return (
            <div className="h-full flex flex-col">

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-100 mb-1">
                            Add / Edit Item
                        </h1>
                        <p className="text-slate-400 text-sm">
                            All fields except description are required; SKU must be unique
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Back
                    </button>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex-1">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Stationery">Stationery</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Price per Unit
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Supplier
                                </label>
                                <select
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Acme Co">Acme Co</option>
                                    <option value="Globex">Globex</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
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
                                    rows={2}
                                    placeholder="Optional"
                                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="px-2 py-1 bg-slate-700 rounded text-xs font-medium">Validation</span>
                                <span>• required fields</span>
                                <span>• unique SKU</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Add Item
            </button>
        </div>
    );
};

export default Inventory;