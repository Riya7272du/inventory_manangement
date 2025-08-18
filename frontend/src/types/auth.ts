export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'admin';
}

export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}