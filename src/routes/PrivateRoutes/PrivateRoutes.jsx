import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loader from '../../components/shared/Loader/Loader';
import useAuth from '../../hooks/useAuth/useAuth.jsx';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader></Loader>;
    }

    if (user && user?.email) {
        return children;
    }

    return <Navigate to="/login" state={location.pathname}></Navigate>;
};

export default PrivateRoutes;