import axios from 'axios';
import type { SignupFormData, LoginFormData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);


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
};

export default api;