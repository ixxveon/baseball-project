import axiosInstance from './axiosInstance';
import type { CommunityPost, PostCategory, PostComment } from '../types';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface ResponsePage<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

export async function getPosts(gameId?: number): Promise<CommunityPost[]> {
    const response = await axiosInstance.get<ApiResponse<ResponsePage<CommunityPost>>>(
        '/community/posts',
        { params: { gameId, size: 50 } },
    );
    return response.data.data.content;
}

export async function getComments(postId: number): Promise<PostComment[]> {
    const response = await axiosInstance.get<ApiResponse<ResponsePage<PostComment>>>(
        `/community/posts/${postId}/comments`,
        { params: { size: 50 } },
    );
    return response.data.data.content;
}

export async function createPost(input: { gameId: number; category: PostCategory; title: string; content: string }): Promise<CommunityPost> {
    const response = await axiosInstance.post<ApiResponse<CommunityPost>>('/community/posts', input);
    return response.data.data;
}

export async function createComment(postId: number, content: string): Promise<PostComment> {
    const response = await axiosInstance.post<ApiResponse<PostComment>>(
        `/community/posts/${postId}/comments`,
        { content },
    );
    return response.data.data;
}
