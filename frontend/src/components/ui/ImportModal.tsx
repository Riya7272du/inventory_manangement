import React, { useState } from 'react';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleImport = () => {
        if (selectedFile) {
            onImport(selectedFile);
            setSelectedFile(null);
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 grid place-items-center pointer-events-auto z-50">
            <div
                className="fixed inset-0 bg-black/55 opacity-100 visible transition-all"
                onClick={handleClose}
                aria-label="Close"
            ></div>
            <div className="w-full max-w-md mx-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transform translate-y-0 opacity-100 transition-all p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-2">Import CSV</h2>
                <p className="text-slate-400 text-sm mb-4">Upload a CSV to add/update items</p>
                <div className="space-y-4">
                    <div className="px-3.5 py-3 rounded-lg border border-slate-600 bg-blue-500/8 text-blue-200 text-xs">
                        Sample columns: Name, Category, Quantity, Price, Supplier, SKU
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedFile && (
                        <p className="text-slate-400 text-xs">Selected: {selectedFile.name}</p>
                    )}
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-600 text-slate-100 bg-white/5 hover:bg-white/10 transition-all"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-blue-500/60 text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:brightness-105 transition-all shadow-lg shadow-blue-500/35 disabled:opacity-60"
                        onClick={handleImport}
                        disabled={!selectedFile}
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;