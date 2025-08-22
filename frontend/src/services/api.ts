import axios from 'axios';
import type { SignupFormData, LoginFormData, InventoryItem, InventoryItemUpdate } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

export const authAPI = {
    signup: async (userData: SignupFormData) => {
        try {
            return await api.post('/auth/signup/', userData);
        } catch (error: any) {
            throw error;
        }
    },

    login: async (credentials: LoginFormData) => {
        try {
            return await api.post('/auth/login/', credentials);
        } catch (error: any) {
            throw error;
        }
    },

    logout: async () => {
        try {
            return await api.post('/auth/logout/');
        } catch (error: any) {
            throw error;
        }
    },
};

export const inventoryAPI = {
    addItem: async (itemData: InventoryItem) => {
        try {
            return await api.post('/inventory/add/', itemData);
        } catch (error: any) {
            throw error;
        }
    },

    getItems: async (params?: {
        cursor?: string;
        category?: string;
        supplier?: string;
        search?: string;
    }) => {
        try {
            return await api.get('/inventory/list/', { params });
        } catch (error: any) {
            throw error;
        }
    },

    getItem: async (id: number) => {
        try {
            return await api.get(`/inventory/${id}/`);
        } catch (error: any) {
            throw error;
        }
    },

    updateItem: async (id: number, itemData: InventoryItemUpdate) => {
        try {
            return await api.patch(`/inventory/${id}/update/`, itemData);
        } catch (error: any) {
            throw error;
        }
    },

    deleteItem: async (id: number) => {
        try {
            return await api.delete(`/inventory/${id}/delete/`);
        } catch (error: any) {
            throw error;
        }
    },
};

export default api;