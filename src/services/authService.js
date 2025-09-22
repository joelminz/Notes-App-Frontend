

import api from '../api';


// Add request/response interceptors if needed (already handled in api.js or can be added there)

// Authentication API calls
export const authService = {
    // Register new user

    register: async (userData) => {
        try {
            const response = await api.post('/api/v1/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login user

    login: async (credentials) => {
        try {
            const response = await api.post('/api/v1/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Get user profile

    getProfile: async () => {
        try {
            const response = await api.get('/api/v1/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },

    // Update user profile

    updateProfile: async (userData) => {
        try {
            const response = await api.put('/api/v1/auth/profile', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/api/v1/auth/change-password', passwordData);
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
            const response = await api.get('/api/v1/allNotes');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch notes' };
        }
    },

    // Add new note
    addNote: async (noteData) => {
        try {
            const response = await api.post('/api/v1/addNote', noteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to add note' };
        }
    },

    // Get single note
    getNote: async (noteId) => {
        try {
            const response = await api.get(`/api/v1/noteDetails/${noteId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch note' };
        }
    },

    // Update note
    updateNote: async (noteId, noteData) => {
        try {
            const response = await api.patch(`/api/v1/updateNote/${noteId}`, noteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update note' };
        }
    },

    // Delete note
    deleteNote: async (noteId) => {
        try {
            const response = await api.delete(`/api/v1/deleteNote/${noteId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete note' };
        }
    }
};

export default api;