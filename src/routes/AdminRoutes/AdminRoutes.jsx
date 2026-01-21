import React from 'react';
import useAuth from '../../hooks/useAuth/useAuth';
import useUserRole from '../../hooks/useUserRole/useUserRole';
import Loader from '../../Components/shared/Loader/Loader';
import { Navigate } from 'react-router';

const AdminRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();

    if (loading || isLoading) {
        return <Loader></Loader>;
    }

    if (!user || (role !== "admin" && role !== "super admin")) {
        return <Navigate to="/forbidden" state={location.pathname}></Navigate>;
    }

    return children;
};

export default AdminRoutes;