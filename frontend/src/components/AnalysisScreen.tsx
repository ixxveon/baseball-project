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

    // 데이터 조회 - gameId가 바뀌거나 언마운트되면 이전 요청 결과는 무시(취소 플래그)
    useEffect(() => {
        if (!gameId) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchGameAnalysis(gameId)
            .then((result) => {
                if (cancelled) return;
                setData(result);
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;

                let errorMessage =
                    '데이터를 불러오는 데 실패했습니다.';

                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (
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

        return () => {
            cancelled = true;
        };
    }, [gameId]);

    // ESC로 닫기 + 배경 스크롤 잠금 (모달이 실제로 떠 있을 때만)
    useEffect(() => {
        if (!gameId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [gameId, onClose]);

    if (!gameId) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="analysis-modal-overlay"
            onClick={handleOverlayClick}
        >
            <div
                className="analysis-modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="analysis-modal-title"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="analysis-close-btn"
                    aria-label="분석 창 닫기"
                >
                    ✕
                </button>

                <h2 id="analysis-modal-title" className="analysis-modal-title">
                    AI 경기 심층 분석
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
                                    홈팀 예상 승률
                                </div>

                                <div className="analysis-stat-value red">
                                    {data.homeWinProb}%
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
                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">선발 투수 분석</div>
                                    <p className="ai-summary-row-content">{data.summary.pitcherComparison}</p>
                                </div>
                            </div>

                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">타선 흐름</div>
                                    <p className="ai-summary-row-content">{data.summary.battingComparison}</p>
                                </div>
                            </div>

                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">구장 및 홈 이점</div>
                                    <p className="ai-summary-row-content">{data.summary.homeAdvantage}</p>
                                </div>
                            </div>

                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">상대전적</div>
                                    <p className="ai-summary-row-content">{data.summary.headToHead}</p>
                                </div>
                            </div>

                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">키플레이어</div>
                                    <p className="ai-summary-row-content">{data.summary.keyPlayer}</p>
                                </div>
                            </div>

                            <div className="ai-summary-row">
                                <div className="ai-summary-row-bar" />
                                <div>
                                    <div className="ai-summary-row-label">날씨</div>
                                    <p className="ai-summary-row-content">{data.summary.weatherComment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}