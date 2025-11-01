import axios from 'axios';
import useAuth from '../useAuth/useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: `https://thrivesecure-server.vercel.app/`
});

const useAxiosSecure = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(
        (config) => {
            if (user?.accessToken) {
                config.headers.authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosSecure.interceptors.response.use(
        res => res,
        error => {
            const status = error.response?.status; // ✅ Correct status retrieval
            if (status === 403) {
                navigate("/forbidden");
            } else if (status === 401) {
                logoutUser()
                    .then(() => navigate("/login"))
                    .catch(() => {});
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;