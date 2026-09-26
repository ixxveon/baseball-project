import React, { useState } from 'react';
import AnalysisScreen from './AnalysisScreen';
import { useTargetGame } from '../hooks/useTargetGame';
import { TEAM_LOGOS } from '../constants/teamLogos';

interface RecommendedGamesProps {
    favoriteTeam: string;
}

export default function RecommendedGames({
                                             favoriteTeam,
                                         }: RecommendedGamesProps): React.JSX.Element {
    const { targetGame, loading, isToday } = useTargetGame(favoriteTeam);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    if (loading) {
        return <div className="recommended-card">불러오는 중...</div>;
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

    const homeTeamLogo = TEAM_LOGOS[targetGame.homeTeamName];
    const awayTeamLogo = TEAM_LOGOS[targetGame.awayTeamName];

    return (
        <div className="recommended-card">
            <div className="recommended-header">
                <span className="badge-today">
                    {isToday ? '오늘의 경기' : '다음 경기'}
                </span>
                <span className="recommended-date">{targetGame.matchDate}</span>
            </div>

            <div className="matchup-container">
                <div className={`team-box ${isFavoriteHome ? 'favorite-team' : ''}`}>
                    <div className="home-away-label">HOME</div>
                    <div className="team-logo">
                        {homeTeamLogo ? (
                            <img src={homeTeamLogo} alt={`${targetGame.homeTeamName} 로고`} />
                        ) : (
                            <span className="team-logo-fallback">{targetGame.homeTeamName}</span>
                        )}
                    </div>
                    <div className="team-name">{targetGame.homeTeamName}</div>
                </div>

                <div className="vs-text">VS</div>

                <div className={`team-box ${isFavoriteAway ? 'favorite-team' : ''}`}>
                    <div className="home-away-label">AWAY</div>
                    <div className="team-logo">
                        {awayTeamLogo ? (
                            <img src={awayTeamLogo} alt={`${targetGame.awayTeamName} 로고`} />
                        ) : (
                            <span className="team-logo-fallback">{targetGame.awayTeamName}</span>
                        )}
                    </div>
                    <div className="team-name">{targetGame.awayTeamName}</div>
                </div>
            </div>

            <div className="metrics-container">
                <div className="metric-item">
                    <div className="metric-label">직관 추천 점수</div>
                    <div className="metric-value green">
                        {targetGame.recommendationScore !== null ? `${targetGame.recommendationScore}점` : '계산중'}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setSelectedGameId(String(targetGame.gameId))}
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