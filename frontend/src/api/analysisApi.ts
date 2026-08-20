export interface GameAnalysisData {
    gameId: string;
    summary: {
        pitcherComparison: string;
        battingComparison: string;
        homeAdvantage: string;
        weatherImpact: string;
    };
    winRate: number;
    scorePredict: string;
}

export async function fetchGameAnalysis(gameId: string): Promise<GameAnalysisData> {
    // 백엔드 Python AI API 엔드포인트 URL
    const response = await fetch(`http://localhost:8000/api/analysis/${gameId}`);

    if (!response.ok) {
        throw new Error('경기 분석 데이터를 불러오는 데 실패했습니다.');
    }

    return response.json();
}