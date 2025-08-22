import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 grid place-items-center z-50">
            <div
                className="fixed inset-0 bg-black/55"
                onClick={onClose}
                aria-label="Close"
            ></div>
            <div className="w-full max-w-md mx-4 bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
                <h2 className="text-xl font-bold text-slate-100 mb-2">Delete item?</h2>
                <p className="text-slate-400 text-sm mb-6">
                    {itemName ? `Are you sure you want to delete "${itemName}"?` : 'Are you sure you want to delete this item?'} This action will be logged.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        className="px-3.5 py-2.5 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3.5 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;