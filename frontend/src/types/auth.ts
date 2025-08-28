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

export interface Transaction {
    id: number;
    transaction_type_display: string;
    item_name: string;
    user_name: string;
    details: string;
    formatted_date: string;
}


export interface FormData {
    name: string;
    category: string;
    quantity: string;
    price: string;
    supplier: string;
    sku: string;
    description: string;
}

export interface FormErrors {
    name?: string;
    category?: string;
    quantity?: string;
    price?: string;
    supplier?: string;
    sku?: string;
    description?: string;
    general?: string;
}

export interface DashboardStats {
    totalItems: number;
    stockValue: number;
    lowStockCount: number;
    supplierCount: number;
    categoryBreakdown: Array<{
        name: string;
        percentage: number;
    }>;
    recentTransactions: Array<{
        id: number;
        formatted_date: string;
        user_name: string;
        transaction_type_display: string;
        item_name: string;
        details: string;
    }>;
    monthlyData: number[];

}