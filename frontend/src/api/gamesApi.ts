import axiosInstance from './axiosInstance';

export interface UpcomingGame {
    gameId: number;
    matchDate: string;
    matchTime: string;
    homeTeamId: number;
    homeTeamName: string;
    awayTeamId: number;
    awayTeamName: string;
    recommendationScore: number | null;
}

export interface RecentRecord {
    wins: number;
    losses: number;
    gamesCount: number;
    winRate: number;
    avgScored: number;
    avgAllowed: number;
}

interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
}

export async function fetchUpcomingGames(): Promise<UpcomingGame[]> {
    const response = await axiosInstance.get<ApiResponse<UpcomingGame[]>>('/ai/games');
    return response.data.data;
}

export async function fetchRecentRecord(teamId: number): Promise<RecentRecord> {
    const response = await axiosInstance.get<ApiResponse<RecentRecord>>(
        `/ai/teams/${teamId}/recent-record`,
    );
    return response.data.data;
}