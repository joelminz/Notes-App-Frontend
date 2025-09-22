import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    // Check if token is expired
                    const decodedToken = jwtDecode(storedToken);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp > currentTime) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token is expired, clear it
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = (userData, authToken) => {
        try {
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', authToken);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Update user profile
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        if (!token) return false;
        
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error('Error checking token:', error);
            logout(); // Clear invalid token
            return false;
        }
    };

    // Get authorization header for API requests
    const getAuthHeader = () => {
        if (isAuthenticated()) {
            return {
                Authorization: `Bearer ${token}`
            };
        }
        return {};
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: isAuthenticated(),
        getAuthHeader
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};