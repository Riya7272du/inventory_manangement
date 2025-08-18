import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    error?: string;
    helpText?: string;
    id?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    error = '',
    helpText = '',
    id
}) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={selectId}
                className="block text-sm"
                style={{ color: '#acb2c7', fontSize: '13px' }}
            >
                {label}
            </label>
            <select
                id={selectId}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${error
                        ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                        : 'focus:ring-blue-500/50 focus:border-blue-400'
                    }`}
                style={{
                    backgroundColor: 'rgba(10,12,24,0.6)',
                    borderColor: error ? '#ef4444' : '#2a3156',
                    color: '#e6e9f2'
                }}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: '#161a2f', color: '#e6e9f2' }}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {helpText && !error && (
                <p className="text-xs" style={{ color: '#acb2c7' }}>
                    {helpText}
                </p>
            )}
            {error && (
                <p className="text-sm" style={{ color: '#fca5a5' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export { Select };