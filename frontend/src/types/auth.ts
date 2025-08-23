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

export interface Supplier {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    linked_items?: number;
    created_at?: string;
    updated_at?: string;
}

export interface InventoryItem {
    id?: number;
    sku: string;
    item_name: string;
    quantity: number;
    price: string;
    category?: string;
    supplier?: number;
    created_at?: string;
    updated_at?: string;
    description?: string;
}

export interface InventoryItemResponse {
    id: number;
    sku: string;
    item_name: string;
    quantity: number;
    price: string;
    category: string | null;
    supplier: string | null;
    created_at: string;
    updated_at: string;
}

export interface InventoryItemUpdate {
    sku?: string;
    item_name?: string;
    quantity?: number;
    price?: string;
    category?: string | null;
    supplier?: number | null;
}

export interface PaginatedInventoryResponse {
    next: string | null;
    previous: string | null;
    results: InventoryItemResponse[];
}

export interface PaginatedSuppliersResponse {
    next: string | null;
    previous: string | null;
    results: Supplier[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_superuser?: boolean;
}