import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validatePassword } from '../utils/validation';

const ResetPasswordForm: React.FC = () => {
    const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!uidb64 || !token) {
            setError('Invalid reset link');
            return;
        }

        setIsLoading(true);

        try {
            await authAPI.resetPassword(uidb64, token, password, confirmPassword);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Failed to reset password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div
                className="min-h-screen flex items-center justify-center p-6"
                style={{
                    background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)'
                }}
            >
                <div
                    className="w-full max-w-md border border-slate-600/50 rounded-xl p-5 shadow-2xl text-center"
                    style={{ backgroundColor: '#161a2f' }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-green-500"></div>
                        <span className="font-bold text-lg text-slate-100">Inventory</span>
                    </div>

                    <div className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                        <h1 className="text-lg font-semibold text-green-400 mb-2">
                            Password Updated!
                        </h1>
                        <p className="text-green-300 text-sm">
                            Your password has been successfully updated. You'll be redirected to login.
                        </p>
                    </div>

                    <Link
                        to="/login"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)'
            }}
        >
            <div
                className="w-full max-w-md border border-slate-600/50 rounded-xl p-5 shadow-2xl"
                style={{ backgroundColor: '#161a2f' }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span className="font-bold text-lg text-slate-100">Inventory</span>
                </div>

                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-100 mb-1">
                        Reset Password
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Enter your new password
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(10,12,24,0.6)' }}
                            placeholder="Enter new password"
                        />
                        <p className="text-slate-400 text-xs mt-1">
                            Must be at least 8 characters with uppercase, lowercase, and numbers
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(10,12,24,0.6)' }}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;