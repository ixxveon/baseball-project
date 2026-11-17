import React, { useState } from 'react';
import AnalysisScreen from './AnalysisScreen';
import TeamBox from './TeamBox.tsx';
import { useTargetGame } from '../hooks/useTargetGame';
import { useLoginRedirect } from '../hooks/useLoginRedirect';
import { getAccessToken } from '../utils/tokenStorage';

interface RecommendedGamesProps {
    favoriteTeam: string;
}

export default function RecommendedGames({
                                             favoriteTeam,
                                         }: RecommendedGamesProps): React.JSX.Element {
    const { targetGame, loading, isToday, error } = useTargetGame(favoriteTeam);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const goToLogin = useLoginRedirect();

    if (loading) {
        return <div className="recommended-card">불러오는 중...</div>;
    }

    if (error) {
        return (
            <div className="recommended-card">
                경기 정보를 불러오는 데 실패했습니다.
            </div>
        );
    }

    if (!targetGame) {
        return (
            <div className="recommended-card">
                오늘의 추천 경기가 없습니다.
            </div>
        );
    }

    const isFavoriteHome = targetGame.homeTeamName === favoriteTeam;
    const isFavoriteAway = targetGame.awayTeamName === favoriteTeam;

    const favoriteRecommendationScore = isFavoriteAway
        ? targetGame.awayRecommendationScore
        : targetGame.recommendationScore;

    return (
        <div className="recommended-card">
            <div className="recommended-header">
                <span className="badge-today">
                    {isToday ? '오늘의 경기' : '다음 경기'}
                </span>
                <span className="recommended-date">{targetGame.matchDate}</span>
            </div>

            <div className="matchup-container">
                <TeamBox side="HOME" teamName={targetGame.homeTeamName} isFavorite={isFavoriteHome} />
                <div className="vs-text">VS</div>
                <TeamBox side="AWAY" teamName={targetGame.awayTeamName} isFavorite={isFavoriteAway} />
            </div>

            <div className="metrics-container">
                <div className="metric-item">
                    <div className="metric-label">직관 추천 점수</div>
                    <div className="metric-value green">
                        {favoriteRecommendationScore !== null ? `${favoriteRecommendationScore}점` : '계산중'}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => {
                    // 상세 분석은 로그인 사용자 전용이라, 비로그인이면 로그인 화면으로 보낸다
                    if (!getAccessToken()) {
                        goToLogin();
                        return;
                    }
                    setSelectedGameId(String(targetGame.gameId));
                }}
                className="analysis-button"
            >
                <span>경기 분석 자세히 보기</span>
                <span>→</span>
            </button>

            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() => setSelectedGameId(null)}
            />
        </div>
    );
}