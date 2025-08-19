import React from 'react';

interface LogoutButtonProps {
    onLogout?: () => void;
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, className = '' }) => {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            console.log('User logged out');
            alert('Logged out successfully!');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg border ${className}`}
            style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: '#2a3156',
                color: '#e6e9f2'
            }}
        >
            Logout
        </button>
    );
};

export { LogoutButton };