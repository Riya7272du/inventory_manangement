import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = ''
}) => {

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60 disabled:cursor-not-allowed border px-4 py-2.5 text-base';

    let buttonStyle: React.CSSProperties;
    let hoverClass: string;

    if (variant === 'primary') {
        buttonStyle = {
            background: 'linear-gradient(180deg, #6e8bff, #5574ff)',
            borderColor: 'rgba(110,139,255,0.6)',
            boxShadow: '0 6px 20px rgba(110,139,255,0.35)',
            color: 'white'
        };
        hoverClass = 'hover:brightness-105';
    } else {
        buttonStyle = {
            background: 'rgba(255,255,255,0.02)',
            borderColor: '#2a3156',
            color: '#e6e9f2'
        };
        hoverClass = 'hover:bg-white/6';
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${hoverClass} ${className}`}
            style={buttonStyle}
        >
            {children}
        </button>
    );
};

export { Button };