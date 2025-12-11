// import { useQuery } from "@tanstack/react-query";
// import useAuth from "../useAuth/useAuth";
// import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

// const useUserRole = () => {
//   const { user, loading } = useAuth(); // ensure useAuth returns loading state
//   const axiosSecure = useAxiosSecure();

//   const { data: userInfo = {}, isLoading: roleLoading } = useQuery({
//     queryKey: ["userInfo", user?.email],
//     enabled: !!user?.email && !loading, // only run when user is available
//     queryFn: async () => {
//       const res = await axiosSecure.get(`users/${user.email}`);
//       return res.data;
//     },
//   });

//   const isLoading = loading || roleLoading;

//   return { role: userInfo?.role, isLoading };
// };

// export default useUserRole;



import { useState, useEffect } from 'react';
import useAuth from '../useAuth/useAuth.jsx'; 

const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Read role from localStorage (set by Login page)
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            // Normalize to lowercase for consistency
            setRole(storedRole.toLowerCase());
        }
        setIsLoading(false);
    }, []);

    return { role, isLoading };
};

export default useUserRole;