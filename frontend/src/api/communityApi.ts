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

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export async function getPosts(gameId?: number): Promise<CommunityPost[]> {
    const response = await axiosInstance.get<ApiResponse<ResponsePage<CommunityPost>>>(
        '/community/posts',
        { params: { gameId, size: 50 } },
    );
    return response.data.data.content.map((post) => ({ ...post, createdAt: formatDate(post.createdAt) }));
}

export async function getComments(postId: number): Promise<PostComment[]> {
    const response = await axiosInstance.get<ApiResponse<ResponsePage<PostComment>>>(
        `/community/posts/${postId}/comments`,
        { params: { size: 50 } },
    );
    return response.data.data.content.map((comment) => ({ ...comment, createdAt: formatDate(comment.createdAt) }));
}

export async function createPost(input: { gameId: number; category: PostCategory; title: string; content: string }): Promise<CommunityPost> {
    const response = await axiosInstance.post<ApiResponse<CommunityPost>>('/community/posts', input);
    return { ...response.data.data, createdAt: formatDate(response.data.data.createdAt) };
}

export async function createComment(postId: number, content: string): Promise<PostComment> {
    const response = await axiosInstance.post<ApiResponse<PostComment>>(
        `/community/posts/${postId}/comments`,
        { content },
    );
    return { ...response.data.data, createdAt: formatDate(response.data.data.createdAt) };
}

export async function updatePost(postId: number, input: { category: PostCategory; title: string; content: string }): Promise<CommunityPost> {
    const response = await axiosInstance.patch<ApiResponse<CommunityPost>>(`/community/posts/${postId}`, input);
    return { ...response.data.data, createdAt: formatDate(response.data.data.createdAt) };
}

export async function deletePost(postId: number): Promise<void> {
    await axiosInstance.delete(`/community/posts/${postId}`);
}

export async function deleteComment(postId: number, commentId: number): Promise<void> {
    await axiosInstance.delete(`/community/posts/${postId}/comments/${commentId}`);
}
