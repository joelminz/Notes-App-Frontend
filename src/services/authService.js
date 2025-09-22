import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API calls
export const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await api.put('/auth/profile', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to change password' };
        }
    }
};

// Notes API calls (with authentication)
export const notesService = {
    // Get all notes
    getAllNotes: async () => {
        try {
            const response = await api.get('/allNotes');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch notes' };
        }
    },

    // Add new note
    addNote: async (noteData) => {
        try {
            const response = await api.post('/addNote', noteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to add note' };
        }
    },

    // Get single note
    getNote: async (noteId) => {
        try {
            const response = await api.get(`/noteDetails/${noteId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch note' };
        }
    },

    // Update note
    updateNote: async (noteId, noteData) => {
        try {
            const response = await api.patch(`/updateNote/${noteId}`, noteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update note' };
        }
    },

    // Delete note
    deleteNote: async (noteId) => {
        try {
            const response = await api.delete(`/deleteNote/${noteId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete note' };
        }
    }
};

export default api;