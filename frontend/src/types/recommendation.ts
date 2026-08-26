// frontend/src/types/recommendation.ts
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