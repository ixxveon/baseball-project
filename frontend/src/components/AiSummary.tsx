import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useTargetGame } from '../hooks/useTargetGame';
import { fetchGameAnalysis, GameAnalysisData } from '../api/analysisApi';
import { getAccessToken } from '../utils/tokenStorage';
import AnalysisScreen from './AnalysisScreen';
import LoginRequiredNotice from './LoginRequiredNotice';

const LOGIN_REQUIRED_MESSAGE = '로그인하면 선발 투수, 타선, 상대전적, 날씨까지 AI 상세 분석을 볼 수 있어요.';

interface AiSummaryProps {
    favoriteTeam: string;
}

interface SummaryItem {
    label: string;
    content: string;
}

function SummaryRow({ label, content }: SummaryItem): React.JSX.Element {
    return (
        <div className="ai-summary-row">
            <div className="ai-summary-row-bar" />
            <div>
                <div className="ai-summary-row-label">{label}</div>
                <p className="ai-summary-row-content">{content}</p>
            </div>
        </div>
    );
}

export default function AiSummary({ favoriteTeam }: AiSummaryProps): React.JSX.Element {
    const { targetGame, loading: gameLoading, error: gameError } = useTargetGame(favoriteTeam);
    const [data, setData] = useState<GameAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showFullReport, setShowFullReport] = useState<boolean>(false);
    const [loginRequired, setLoginRequired] = useState<boolean>(false);
    const isLoggedIn = Boolean(getAccessToken());

    useEffect(() => {
        if (gameLoading || gameError) return;

        if (!targetGame) {
            setData(null);
            setError(null);
            setLoginRequired(false);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);
        setLoginRequired(false);

        fetchGameAnalysis(String(targetGame.gameId))
            .then((result) => {
                if (cancelled) return;
                setData(result);
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                // 비로그인이고 아직 저장된 분석이 없으면 서버가 401을 준다 → 오류가 아니라 로그인 안내를 보여준다
                if (isAxiosError(err) && err.response?.status === 401) {
                    setData(null);
                    setLoginRequired(true);
                } else {
                    setError('AI 분석 데이터를 불러오는 데 실패했습니다.');
                }
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [targetGame, gameLoading, gameError]);

    const noGame = !gameLoading && !gameError && !loading && !error && !targetGame;
    const ready = !gameLoading && !gameError && !loading && !error;

    const items: SummaryItem[] = data ? [
        { label: '선발 투수 분석', content: data.summary.pitcherComparison },
        { label: '타선 흐름', content: data.summary.battingComparison },
        { label: '상대전적', content: data.summary.headToHead },
        { label: '날씨', content: data.summary.weatherComment },
    ] : [];

    return (
        <div className="ai-summary-card">
            <div>
                <h3 className="ai-summary-title">AI 분석 요약</h3>

                {!gameError && (gameLoading || loading) && (
                    <p className="ai-summary-status">분석 중입니다...</p>
                )}

                {gameError && (
                    <p className="ai-summary-error">경기 목록을 불러오는 데 실패했습니다.</p>
                )}

                {!gameError && error && (
                    <p className="ai-summary-error">{error}</p>
                )}

                {noGame && (
                    <p className="ai-summary-status">표시할 예정 경기가 없습니다.</p>
                )}

                {ready && loginRequired && (
                    <LoginRequiredNotice message={LOGIN_REQUIRED_MESSAGE} />
                )}

                {ready && data && isLoggedIn && (
                    <div>
                        {items.map((item) => (
                            <SummaryRow key={item.label} label={item.label} content={item.content} />
                        ))}
                    </div>
                )}

                {/* 비로그인은 이미 저장된 분석이 있어도 승률·스코어만 보여주고 상세 근거는 로그인 후에 보여준다 */}
                {ready && data && !isLoggedIn && (
                    <LoginRequiredNotice message={LOGIN_REQUIRED_MESSAGE} />
                )}
            </div>

            {ready && data && (
                <div className="ai-summary-footer">
                    <div className="ai-summary-verdict">
                        <span className="ai-summary-verdict-label">AI 종합</span>{' '}
                        홈팀 예상 승률 {data.homeWinProb}%, 예상 스코어 {data.scorePredict}
                    </div>

                    {isLoggedIn && (
                        <button
                            type="button"
                            onClick={() => setShowFullReport(true)}
                            className="ai-summary-detail-btn"
                        >
                            상세분석 보기 →
                        </button>
                    )}
                </div>
            )}

            <AnalysisScreen
                gameId={showFullReport && targetGame ? String(targetGame.gameId) : null}
                onClose={() => setShowFullReport(false)}
            />
        </div>
    );
}