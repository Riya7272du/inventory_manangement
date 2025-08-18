import React from 'react';

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    id?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error = '',
    id
}) => {

    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={inputId}
                className="block text-sm"
                style={{ color: '#acb2c7', fontSize: '13px' }}
            >
                {label}
            </label>
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${error
                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                    : 'focus:ring-blue-500/50 focus:border-blue-400'
                    }`}
                style={{
                    backgroundColor: 'rgba(10,12,24,0.6)',
                    borderColor: error ? '#ef4444' : '#2a3156',
                    color: '#e6e9f2'
                }}
            />
            {error && (
                <p className="text-sm" style={{ color: '#fca5a5' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export { Input };