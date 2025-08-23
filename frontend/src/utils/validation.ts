export const validateName = (name: string): string | null => {
    if (!name.trim()) {
        return 'Name is required';
    }
    if (name.length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (name.length > 50) {
        return 'Name must be less than 50 characters';
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
};

export const validateRole = (role: string): string | null => {
    if (role !== 'manager' && role !== 'admin') {
        return 'Please select a valid role';
    }
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim().length === 0) {
        return 'Phone is required';
    }

    const Phone = phone.trim().replace(/[\s\-\(\)]/g, '');

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(Phone)) {
        return 'Please enter a valid phone number';
    }

    if (Phone.length < 10) {
        return 'Phone number must be at least 10 digits';
    }

    return null;
};

