import type { RecommendationGrade } from '../constants/grade';

export interface GameRecommendation {
    gameId: number;
    gameDate: string;
    teamId: number;
    teamName: string;
    opponentTeamId: number;
    opponentTeamName: string;
    winProbability: number;
    recommendationScore: number;
    recommendationGrade: string;
}

export type GamePick = GameRecommendation;

export interface RecommendedGame {
    id: number;
    homeTeam: string;
    awayTeam: string;
    grade: RecommendationGrade;
}