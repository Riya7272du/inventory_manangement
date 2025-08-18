import React, { useState } from 'react';
import type { SignupFormData, FormErrors } from '../types/auth';
import { validateName, validateEmail, validatePassword, validateRole } from '../utils/validation';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
];

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        role: 'manager',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [isLoading, setIsLoading] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, email: e.target.value }));
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, password: e.target.value }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, role: e.target.value as 'manager' | 'admin' }));
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const roleError = validateRole(formData.role);
        if (roleError) newErrors.role = roleError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Form submitted:', formData);
            alert('Account created successfully!');

            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'manager',
            });
            setErrors({});

        } catch (error) {
            console.error('Error creating account:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goBackToLogin = () => {
        console.log('Going back to login...');
        alert('Redirecting to login page...');
    };

    const containerStyle = {
        background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)',
        color: '#e6e9f2',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
    };

    const cardStyle = {
        background: '#161a2f',
        borderColor: '#2a3156',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
    };

    const logoStyle = {
        background: 'linear-gradient(135deg, #6e8bff, #22c55e)',
        boxShadow: '0 6px 20px rgba(110,139,255,0.35)'
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={containerStyle}
        >
            <div className="w-full max-w-md">
                <div
                    className="p-5 rounded-xl border shadow-2xl"
                    style={cardStyle}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={logoStyle}
                        >
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white m-0">
                                Create account
                            </h2>
                            <p className="text-sm m-0 mt-0.5" style={{ color: '#acb2c7' }}>
                                Join Inventory Management
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder="Enter your full name"
                            error={errors.name}
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email address"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            placeholder="Create a strong password"
                            error={errors.password}
                        />

                        <Select
                            label="Role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            helpText="Role-based access: Admin, Manager"
                            error={errors.role}
                        />

                        {/* Buttons */}
                        <div className="flex gap-3 pt-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={goBackToLogin}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Back to Login
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create account'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export { SignupForm };