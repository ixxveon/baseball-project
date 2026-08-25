import axiosInstance from './axiosInstance';

export interface SignupRequest {
    email: string;
    nickname: string;
    password: string;
}

export interface SignupResponse {
    userId: number;
    email: string;
    nickname: string;
}

export interface SignupValidationErrors {
    email?: string;
    nickname?: string;
    password?: string;
    passwordConfirm?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function signup(request: SignupRequest): Promise<SignupResponse> {
    const response = await axiosInstance.post<ApiResponse<SignupResponse>>('/members/signup', request);
    return response.data.data;
}

export async function checkNicknameAvailability(nickname: string): Promise<boolean> {
    const response = await axiosInstance.get<ApiResponse<{ available: boolean }>>(
        '/members/nickname-availability',
        { params: { nickname } },
    );
    return response.data.data.available;
}

export async function sendEmailVerification(email: string): Promise<void> {
    await axiosInstance.post('/members/email-verification/send', { email });
}

export async function confirmEmailVerification(email: string, code: string): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<{ verified: boolean }>>(
        '/members/email-verification/confirm',
        { email, code },
    );
    return response.data.data.verified;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresAt: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/members/login', request);
    return response.data.data;
}
