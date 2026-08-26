import React, { useEffect, useState } from 'react';
import { fetchGameAnalysis, GameAnalysisData } from '../api/analysisApi.ts';

interface AnalysisScreenProps {
    gameId: string | null;
    onClose: () => void;
}

export default function AnalysisScreen({
                                           gameId,
                                           onClose,
                                       }: AnalysisScreenProps): React.JSX.Element | null {
    const [data, setData] = useState<GameAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        setLoading(true);
        setError(null);

        fetchGameAnalysis(gameId)
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err: unknown) => {
                let errorMessage =
                    '데이터를 불러오는 데 실패했습니다.';

                // 일반적인 JavaScript Error
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                // Axios Error 등에서 response.data.message가 있는 경우
                else if (
                    typeof err === 'object' &&
                    err !== null &&
                    'response' in err
                ) {
                    const axiosError = err as {
                        response?: {
                            data?: {
                                message?: string;
                            };
                        };
                    };

                    if (axiosError.response?.data?.message) {
                        errorMessage =
                            axiosError.response.data.message;
                    }
                }

                setError(errorMessage);
                setLoading(false);
            });
    }, [gameId]);

    if (!gameId) return null;

    return (
        <div className="analysis-modal-overlay">
            <div className="analysis-modal-container">
                <button
                    type="button"
                    onClick={onClose}
                    className="analysis-close-btn"
                >
                    ✕
                </button>

                <h2 className="analysis-modal-title">
                    🤖 AI 경기 심층 분석
                </h2>

                {loading && (
                    <div className="analysis-loading-text">
                        AI가 최근 데이터 및 예측 모델을 분석 중입니다...
                    </div>
                )}

                {error && (
                    <div className="analysis-error-box">
                        {error}
                    </div>
                )}

                {!loading && !error && data && (
                    <div className="analysis-content-wrapper">
                        <div className="analysis-stats-box">
                            <div className="analysis-stat-item">
                                <div className="analysis-stat-label">
                                    예상 승률
                                </div>

                                <div className="analysis-stat-value red">
                                    {data.winRate}%
                                </div>
                            </div>

                            <div className="analysis-stat-item">
                                <div className="analysis-stat-label">
                                    예상 스코어
                                </div>

                                <div className="analysis-stat-value dark">
                                    {data.scorePredict}
                                </div>
                            </div>
                        </div>

                        <div className="analysis-text-details">
                            <p>
                                <strong>
                                    ⚾ 선발 투수 분석:
                                </strong>{' '}
                                {data.summary.pitcherComparison}
                            </p>

                            <p>
                                <strong>
                                    🏏 타선 흐름:
                                </strong>{' '}
                                {data.summary.battingComparison}
                            </p>

                            <p>
                                <strong>
                                    🏟️ 구장 및 홈 이점:
                                </strong>{' '}
                                {data.summary.homeAdvantage}
                            </p>

                            <p>
                                <strong>
                                    ☀️ 날씨 영향:
                                </strong>{' '}
                                {data.summary.weatherImpact}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
