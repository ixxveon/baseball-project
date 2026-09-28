import React, { useEffect, useRef, useState } from 'react';
import { fetchGameAnalysis, GameAnalysisData } from '../api/analysisApi.ts';

interface AnalysisScreenProps {
    gameId: string | null;
    onClose: () => void;
}

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function AnalysisScreen({
                                           gameId,
                                           onClose,
                                       }: AnalysisScreenProps): React.JSX.Element | null {
    const [data, setData] = useState<GameAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

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

    // ESC로 닫기 + 배경 스크롤 잠금 + 포커스 이동/트랩 (모달이 실제로 떠 있을 때만)
    useEffect(() => {
        if (!gameId) return;

        previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();

        const getFocusableElements = (): HTMLElement[] => {
            const container = modalContainerRef.current;
            if (!container) return [];
            return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key !== 'Tab') return;

            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            const activeInsideModal = active instanceof Node && modalContainerRef.current?.contains(active);

            if (e.shiftKey) {
                if (!activeInsideModal || active === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (!activeInsideModal || active === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocusedElementRef.current?.focus();
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
                ref={modalContainerRef}
                className="analysis-modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="analysis-modal-title"
            >
                <button
                    ref={closeButtonRef}
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