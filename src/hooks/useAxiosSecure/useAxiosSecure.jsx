import axios from 'axios';
import useAuth from '../useAuth/useAuth';
import { useNavigate } from 'react-router';
import API_BASE_URL from '../../config/api';

const axiosSecure = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important: This ensures cookies are sent with requests
});

const useAxiosSecure = () => {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosSecure.interceptors.response.use(
        res => res,
        error => {
            const status = error.response?.status;
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
