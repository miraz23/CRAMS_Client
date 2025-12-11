import React, { useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext/AuthContext";
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const storedUser = localStorage.getItem('studentUser');
            const role = localStorage.getItem('userRole');
            if (storedUser && role) {
                setUser(JSON.parse(storedUser));
            } else if (role) {
                setUser({ role });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (email, password, role) => {
        setLoading(true);
        try {
            let endpoint = '';
            let loginData = {};

            // Determine which endpoint to use based on role
            if (role === 'Admin') {
                endpoint = `${API_BASE_URL}/admin/login`;
                loginData = { email, password };
            } else if (role === 'Student') {
                endpoint = `${API_BASE_URL}/student/login`;
                // Student login uses studentId instead of email
                loginData = { studentId: email, password };
            } else {
                // Advisor/Teacher login - adjust based on your backend
                endpoint = `${API_BASE_URL}/teacher/login`;
                loginData = { email, password };
            }

            const response = await axios.post(endpoint, loginData, {
                withCredentials: true, // Important for cookies
            });

            if (response.data.success) {
                const userData = response.data.data || response.data.user || {};
                const normalizedUser = {
                    ...userData,
                    role,
                    email: userData.email || email,
                    name: userData.name || userData.studentId || userData.email || '',
                    studentId: userData.studentId,
                };
                setUser(normalizedUser);
                localStorage.setItem('userRole', role);
                localStorage.setItem('studentUser', JSON.stringify(normalizedUser));
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData) => {
        setLoading(true);
        try {
            let endpoint = '';
            let registrationData = {};

            const { email, password, role, fullName, studentId } = userData;

            if (role === 'Admin') {
                endpoint = `${API_BASE_URL}/admin/register`;
                registrationData = { name: fullName, email, password };
            } else if (role === 'Student') {
                endpoint = `${API_BASE_URL}/student/register`;
                // Student registration requires more fields - adjust as needed
                registrationData = {
                    name: fullName,
                    studentId,
                    email,
                    password,
                    // Add required fields based on your backend
                    mobileNumber: '',
                    department: '',
                };
            } else {
                // Advisor/Teacher registration
                endpoint = `${API_BASE_URL}/teacher/register`;
                registrationData = { name: fullName, email, password };
            }

            const response = await axios.post(endpoint, registrationData, {
                withCredentials: true,
            });

            if (response.data.success) {
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updatedData) => {
        // Update user profile via backend API
        // This will depend on your backend endpoints
        try {
            const role = localStorage.getItem('userRole');
            // Implement based on your backend API structure
            return { success: true };
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            const role = localStorage.getItem('userRole');
            let endpoint = '';

            if (role === 'Admin') {
                endpoint = `${API_BASE_URL}/admin/logout`;
            } else if (role === 'Student') {
                endpoint = `${API_BASE_URL}/student/logout`;
            } else {
                endpoint = `${API_BASE_URL}/teacher/logout`;
            }

            await axios.post(endpoint, {}, {
                withCredentials: true,
            });

            setUser(null);
            localStorage.removeItem('userRole');
            localStorage.removeItem('studentUser');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even if API call fails
            setUser(null);
            localStorage.removeItem('userRole');
            localStorage.removeItem('studentUser');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        updateUser,
        loginUser,
        logoutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;