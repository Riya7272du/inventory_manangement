import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validateEmail } from '../utils/validation';

const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);
            setMessage('If that email exists, a reset link has been sent to your inbox');
            setEmail('');
        } catch (error: any) {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                        Forgot Password
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Enter your email to receive a reset link
                    </p>
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-green-600/20 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 text-sm">{message}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(10,12,24,0.6)' }}
                            placeholder="your@email.com"
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
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
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

export default ForgotPasswordForm;