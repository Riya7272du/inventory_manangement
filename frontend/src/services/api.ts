import axios from 'axios';
import type { SignupFormData, LoginFormData, InventoryItem } from '../types/auth';

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
            const response = await api.post('/auth/signup/', userData);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    login: async (credentials: LoginFormData) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await api.post('/auth/logout/');
            return response;
        } catch (error: any) {
            throw error;
        }
    },
};

export const inventoryAPI = {
    addItem: async (itemData: InventoryItem) => {
        try {
            const response = await api.post('/inventory/add/', itemData);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
};

export default api;