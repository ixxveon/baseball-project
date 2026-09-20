import React, { useEffect, useState } from 'react';
import { useTargetGame } from '../hooks/useTargetGame';
import { fetchGameAnalysis, GameAnalysisData } from '../api/analysisApi';
import AnalysisScreen from './AnalysisScreen';

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
    const { targetGame, loading: gameLoading } = useTargetGame(favoriteTeam);
    const [data, setData] = useState<GameAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showFullReport, setShowFullReport] = useState<boolean>(false);

    useEffect(() => {
        if (gameLoading) return;

        if (!targetGame) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchGameAnalysis(String(targetGame.gameId))
            .then((result) => {
                if (cancelled) return;
                setData(result);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setError('AI 분석 데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [targetGame, gameLoading]);

    const noGame = !gameLoading && !loading && !error && !targetGame;

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

                {(gameLoading || loading) && (
                    <p className="ai-summary-status">분석 중입니다...</p>
                )}

                {error && (
                    <p className="ai-summary-error">{error}</p>
                )}

                {noGame && (
                    <p className="ai-summary-status">표시할 예정 경기가 없습니다.</p>
                )}

                {!gameLoading && !loading && !error && data && (
                    <div>
                        {items.map((item) => (
                            <SummaryRow key={item.label} label={item.label} content={item.content} />
                        ))}
                    </div>
                )}
            </div>

            {!gameLoading && !loading && !error && data && (
                <div className="ai-summary-footer">
                    <div className="ai-summary-verdict">
                        <span className="ai-summary-verdict-label">AI 종합</span>{' '}
                        홈팀 예상 승률 {data.homeWinProb}%, 예상 스코어 {data.scorePredict}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowFullReport(true)}
                        className="ai-summary-detail-btn"
                    >
                        상세분석 보기 →
                    </button>
                </div>
            )}

            <AnalysisScreen
                gameId={showFullReport && targetGame ? String(targetGame.gameId) : null}
                onClose={() => setShowFullReport(false)}
            />
        </div>
    );
}