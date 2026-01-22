import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loader from '../../Components/shared/Loader/Loader';
import useAuth from '../../hooks/useAuth/useAuth.jsx';
import useUserRole from '../../hooks/useUserRole/useUserRole';

const PrivateRoutes = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return <Loader></Loader>;
    }

    if (!user || !user?.email) {
        return <Navigate to="/login" state={location.pathname}></Navigate>;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const normalizedRole = role?.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
        
        if (!normalizedRole || !normalizedAllowedRoles.includes(normalizedRole)) {
            return <Navigate to="/forbidden" state={location.pathname}></Navigate>;
        }
    }

    return children;
};

export default PrivateRoutes;
