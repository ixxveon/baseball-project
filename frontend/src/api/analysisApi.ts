import axiosInstance from './axiosInstance';

export interface GameAnalysisSummary {
    pitcherComparison: string;
    battingComparison: string;
    homeAdvantage: string;
    headToHead: string;
    keyPlayer: string;
    weatherComment: string;
}

export interface GameAnalysisData {
    gameId: number;
    homeWinProb: number;
    scorePredict: string;
    summary: GameAnalysisSummary;
}

interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
}

interface PredictionResultData {
    gameId: number;
    result: {
        homeWinProb: number;
        scorePredict: string;
        summary: GameAnalysisSummary;
    };
}

export async function fetchGameAnalysis(gameId: string): Promise<GameAnalysisData> {
    const response = await axiosInstance.post<ApiResponse<PredictionResultData>>(
        '/ai/predict',
        { gameId: Number(gameId) },
    );

    const { gameId: id, result } = response.data.data;

    return {
        gameId: id,
        homeWinProb: result.homeWinProb,
        scorePredict: result.scorePredict,
        summary: result.summary,
    };
}