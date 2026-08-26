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

// 👈 이 부분이 없어서 오류가 났던 것입니다. 아래와 같이 별칭을 추가해 주세요!
export type GamePick = GameRecommendation;