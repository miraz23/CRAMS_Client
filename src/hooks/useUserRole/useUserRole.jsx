







import { useState, useEffect } from 'react';
import useAuth from '../useAuth/useAuth.jsx'; 

const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setRole(storedRole.toLowerCase());
        }
        setIsLoading(false);
    }, []);

    return { role, isLoading };
};

export default useUserRole;
