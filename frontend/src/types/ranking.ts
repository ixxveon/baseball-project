// frontend/src/types/ranking.ts
export interface ResponseRanking {
    teamRank: number;
    teamName: string;
    games: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: string;
    gameDiff: string;
    streak: string;
}