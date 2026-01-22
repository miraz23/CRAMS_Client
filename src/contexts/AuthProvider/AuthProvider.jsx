import React, { useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext/AuthContext";
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

            if (role === 'Admin') {
                endpoint = `${API_BASE_URL}/admin/login`;
                loginData = { email, password };
            } else if (role === 'Student') {
                endpoint = `${API_BASE_URL}/student/login`;
                loginData = { studentId: email, password };
            } else {
                endpoint = `${API_BASE_URL}/teacher/login`;
                loginData = { email, password };
            }

            const response = await axios.post(endpoint, loginData, {
                withCredentials: true, // Important for cookies
            });

            if (response.data.success) {
                const userData = response.data.data || response.data.user || {};
                let derivedRole = role;
                
                if (role === 'Admin') {
                    derivedRole = userData.privilege || role;
                } 
                else if (role === 'Teacher' || role === 'Advisor') {
                    if (userData.privilege === 'Advisor') {
                        derivedRole = 'Advisor';
                    } else {
                        derivedRole = 'Teacher';
                    }
                }
                
                const normalizedRole = derivedRole.toLowerCase();
                const normalizedUser = {
                    ...userData,
                    role: normalizedRole,
                    email: userData.email || email,
                    name: userData.name || userData.studentId || userData.email || '',
                    studentId: userData.studentId,
                };
                setUser(normalizedUser);
                localStorage.setItem('userRole', normalizedRole);
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

            const { email, password, role, fullName } = userData;

            endpoint = `${API_BASE_URL}/teacher/register`;
            registrationData = { name: fullName, email, password };

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
        try {
            const role = localStorage.getItem('userRole');
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
