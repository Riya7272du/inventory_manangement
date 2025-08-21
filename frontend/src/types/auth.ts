export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'admin';
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

export type AuthMode = 'login' | 'signup';

export interface InventoryItem {
    sku: string;
    item_name: string;
    quantity: number;
    price: string;
    category: string;
    supplier: string;
    description?: string;
}