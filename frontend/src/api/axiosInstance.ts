import axios, { type AxiosInstance } from 'axios';
import {clearAccessToken, getAccessToken} from '../utils/tokenStorage';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAccessToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
