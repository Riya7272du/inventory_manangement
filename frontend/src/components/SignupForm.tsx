import React, { useState } from 'react';
import type { SignupFormData, LoginFormData, FormErrors, AuthMode } from '../types/auth';
import { validateName, validateEmail, validatePassword, validateRole } from '../utils/validation';
import { authStyles } from '../styles/signup_styles';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
];

const AuthForm: React.FC = () => {

    const [authMode, setAuthMode] = useState<AuthMode>('signup');
    const [signupData, setSignupData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        role: 'manager',
    });

    const [loginData, setLoginData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [isLoading, setIsLoading] = useState(false);

    const toggleAuthMode = () => {
        setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
        setErrors({});
    };

    const handleSignupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData(prev => ({ ...prev, name: e.target.value }));
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    };

    const handleSignupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData(prev => ({ ...prev, email: e.target.value }));
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handleSignupPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData(prev => ({ ...prev, password: e.target.value }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleSignupRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSignupData(prev => ({
            ...prev,
            role: e.target.value as 'manager' | 'admin'
        }));
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: undefined }));
        }
    };

    const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData(prev => ({ ...prev, email: e.target.value }));
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handleLoginPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData(prev => ({ ...prev, password: e.target.value }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const validateSignupForm = (): boolean => {
        const newErrors: FormErrors = {};

        const nameError = validateName(signupData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(signupData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(signupData.password);
        if (passwordError) newErrors.password = passwordError;

        const roleError = validateRole(signupData.role);
        if (roleError) newErrors.role = roleError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLoginForm = (): boolean => {
        const newErrors: FormErrors = {};

        const emailError = validateEmail(loginData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(loginData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = authMode === 'signup' ? validateSignupForm() : validateLoginForm();

        if (!isValid) {
            return;
        }

        setIsLoading(true);

        try {

            await new Promise(resolve => setTimeout(resolve, 1500));

            if (authMode === 'signup') {
                console.log('Signup data:', signupData);
                alert('Account created successfully!');
                setSignupData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'manager',
                });
            } else {
                console.log('Login data:', loginData);
                alert('Login successful! Redirecting to dashboard...');
                setLoginData({
                    email: '',
                    password: '',
                });
            }

            setErrors({});

        } catch (error) {
            console.error(`Error during ${authMode}:`, error);
            alert(`Something went wrong during ${authMode}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };
    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
        alert('Forgot password functionality would go here');
    };
    const currentEmail = authMode === 'signup' ? signupData.email : loginData.email;
    const currentPassword = authMode === 'signup' ? signupData.password : loginData.password;

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={authStyles.container}
        >
            <div className="w-full max-w-md">
                <div
                    className="p-5 rounded-xl border shadow-2xl"
                    style={authStyles.card}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={authStyles.logo}
                        >
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white m-0">
                                {authMode === 'signup' ? 'Create account' : 'Welcome back'}
                            </h2>
                            <p className="text-sm m-0 mt-0.5" style={authStyles.subtitle}>
                                {authMode === 'signup' ? 'Join Inventory Management' : 'Sign in to your account'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {authMode === 'signup' && (
                            <Input
                                label="Full Name"
                                type="text"
                                value={signupData.name}
                                onChange={handleSignupNameChange}
                                placeholder="Enter your full name"
                                error={errors.name}
                            />
                        )}

                        <Input
                            label="Email"
                            type="email"
                            value={currentEmail}
                            onChange={authMode === 'signup' ? handleSignupEmailChange : handleLoginEmailChange}
                            placeholder="Enter your email address"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={currentPassword}
                            onChange={authMode === 'signup' ? handleSignupPasswordChange : handleLoginPasswordChange}
                            placeholder={authMode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                            error={errors.password}
                        />

                        {authMode === 'signup' && (
                            <Select
                                label="Role"
                                value={signupData.role}
                                onChange={handleSignupRoleChange}
                                options={roleOptions}
                                helpText="Role-based access: Admin, Manager"
                                error={errors.role}
                            />
                        )}

                        {authMode === 'login' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm hover:underline"
                                    style={authStyles.link}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <div className="pt-3">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (authMode === 'signup' ? 'Creating...' : 'Signing in...')
                                    : (authMode === 'signup' ? 'Create account' : 'Login')
                                }
                            </Button>
                        </div>

                        <div className="text-center pt-2">
                            <span style={authStyles.smallText}>
                                {authMode === 'signup' ? 'Already have an account?' : 'No account?'}{' '}
                                <button
                                    type="button"
                                    onClick={toggleAuthMode}
                                    className="hover:underline font-medium"
                                    style={authStyles.link}
                                >
                                    {authMode === 'signup' ? 'Sign in' : 'Create one'}
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { AuthForm };