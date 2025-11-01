import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth/useAuth";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useUserRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userInfo = {}, isLoading } = useQuery({
        queryKey: ["userInfo", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`users/${user.email}`);
            return res.data;
        },
    });

    return { role: userInfo?.role, isLoading };
};

export default useUserRole;