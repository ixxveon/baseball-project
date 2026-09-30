import axios, { type AxiosError, type AxiosInstance } from 'axios';
import {clearAccessToken, getAccessToken} from '../utils/tokenStorage';

const LOGIN_URL = '/members/login';

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
    (error: AxiosError) => {
        const isUnauthorized = error.response?.status === 401;
        const hadAccessToken = Boolean(error.config?.headers?.Authorization);
        const isLoginRequest = error.config?.url === LOGIN_URL;

        // 토큰을 달고 보낸 요청이 401이면 세션 만료로 보고 로그인 화면으로 보낸다.
        // 로그인 요청의 401은 자격 증명 오류이므로 호출한 화면에서 직접 처리하게 그대로 넘긴다.
        if (isUnauthorized && hadAccessToken && !isLoginRequest) {
            clearAccessToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
