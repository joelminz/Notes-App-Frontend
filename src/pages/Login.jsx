import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login(formData);
            
            if (response.success) {
                // Login successful
                login(response.data.user, response.data.token);
                
                Swal.fire({
                    title: 'Success!',
                    text: response.message,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);
            
            Swal.fire({
                title: 'Login Failed',
                text: error.message || 'An error occurred during login',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });

            if (error.errors) {
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path] = err.msg;
                });
                setErrors(fieldErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: '#333',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>Login</h2>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.email ? '1px solid #ef4444' : '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '14px',
                                backgroundColor: errors.email ? '#fef2f2' : 'white'
                            }}
                        />
                        {errors.email && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                marginTop: '5px',
                                margin: '5px 0 0 0'
                            }}>{errors.email}</p>
                        )}
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.password ? '1px solid #ef4444' : '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '14px',
                                backgroundColor: errors.password ? '#fef2f2' : 'white'
                            }}
                        />
                        {errors.password && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                marginTop: '5px',
                                margin: '5px 0 0 0'
                            }}>{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: loading ? '#9ca3af' : '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '14px'
                }}>Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: '#4f46e5',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;