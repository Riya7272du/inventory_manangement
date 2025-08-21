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
        <div className="fixed inset-0 grid place-items-center pointer-events-auto z-50">
            <div
                className="fixed inset-0 bg-black/55 opacity-100 visible transition-all"
                onClick={onClose}
                aria-label="Close"
            ></div>
            <div className="w-full max-w-md mx-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transform translate-y-0 opacity-100 transition-all p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-2">Delete item?</h2>
                <p className="text-slate-400 text-sm mb-6">
                    {itemName ? `Are you sure you want to delete "${itemName}"?` : 'Are you sure you want to delete this item?'} This action will be logged in transaction history.
                </p>
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10 transition-all"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-500/60 text-white bg-gradient-to-b from-red-500 to-red-600 hover:brightness-105 transition-all"
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