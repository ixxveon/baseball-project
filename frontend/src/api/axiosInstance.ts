import axios, { type AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
