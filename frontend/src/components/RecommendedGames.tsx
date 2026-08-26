import React, { useEffect, useState } from 'react';
import AnalysisScreen from './AnalysisScreen';
import { gamesData } from '../data/games';
import type { GameRecommendation } from '../types/recommendation';

interface RecommendedGamesProps {
    favoriteTeam: string;
}

/*
 * 팀 로고 경로
 *
 * public/
 * └── images/
 *     └── teams/
 *         ├── lg.png
 *         ├── doosan.png
 *         ├── kia.png
 *         ├── samsung.png
 *         ├── lotte.png
 *         ├── hanwha.png
 *         ├── ssg.png
 *         ├── kiwoom.png
 *         ├── nc.png
 *         └── kt.png
 */
const teamLogos: Record<string, string> = {
    'LG 트윈스': '/images/teams/lg.png',
    '두산 베어스': '/images/teams/doosan.png',
    '기아 타이거즈': '/images/teams/kia.png',
    '삼성 라이온즈': '/images/teams/samsung.png',
    '롯데 자이언츠': '/images/teams/lotte.png',
    '한화 이글스': '/images/teams/hanwha.png',
    'SSG 랜더스': '/images/teams/ssg.png',
    '키움 히어로즈': '/images/teams/kiwoom.png',
    'NC 다이노스': '/images/teams/nc.png',
    'KT 위즈': '/images/teams/kt.png',
};

export default function RecommendedGames({
                                             favoriteTeam,
                                         }: RecommendedGamesProps): React.JSX.Element {
    const [selectedGameId, setSelectedGameId] =
        useState<string | null>(null);

    const [targetGame, setTargetGame] =
        useState<GameRecommendation | null>(null);

    useEffect(() => {
        /*
         * 오늘 날짜
         * YYYY-MM-DD
         */
        const todayStr = new Date()
            .toISOString()
            .split('T')[0];

        /*
         * 오늘 경기 중
         * 응원팀이 출전하는 경기 검색
         */
        const favoriteGame = gamesData.find(
            (game) =>
                game.gameDate === todayStr &&
                (
                    game.teamName === favoriteTeam ||
                    game.opponentTeamName === favoriteTeam
                )
        );

        /*
         * 경기 선택 우선순위
         *
         * 1. 오늘 + 응원팀 경기
         * 2. 오늘 경기
         * 3. 목업 데이터 첫 번째 경기
         */
        const foundGame =
            favoriteGame ||
            gamesData.find(
                (game) => game.gameDate === todayStr
            ) ||
            gamesData[0];

        setTargetGame(foundGame);
    }, [favoriteTeam]);

    /*
     * 경기 데이터가 없는 경우
     */
    if (!targetGame) {
        return (
            <div className="recommended-card">
                오늘의 추천 경기가 없습니다.
            </div>
        );
    }

    /*
     * 응원팀이 홈팀인지 확인
     */
    const isFavoriteHome =
        targetGame.teamName === favoriteTeam;

    /*
     * 응원팀이 원정팀인지 확인
     */
    const isFavoriteAway =
        targetGame.opponentTeamName === favoriteTeam;

    /*
     * 홈팀 / 원정팀 로고
     */
    const homeTeamLogo =
        teamLogos[targetGame.teamName];

    const awayTeamLogo =
        teamLogos[targetGame.opponentTeamName];

    return (
        <div className="recommended-card">

            {/* ================================================
                추천 경기 헤더
            ================================================= */}

            <div className="recommended-header">
                <span className="badge-today">
                    오늘의 경기
                </span>

                <span className="recommended-date">
                    {targetGame.gameDate}
                </span>
            </div>


            {/* ================================================
                경기 매치업
            ================================================= */}

            <div className="matchup-container">

                {/* ============================================
                    HOME TEAM
                ============================================= */}

                <div
                    className={`team-box ${
                        isFavoriteHome
                            ? 'favorite-team'
                            : ''
                    }`}
                >
                    {/* HOME */}
                    <div className="home-away-label">
                        HOME
                    </div>

                    {/* 로고 */}
                    <div className="team-logo">
                        {homeTeamLogo ? (
                            <img
                                src={homeTeamLogo}
                                alt={`${targetGame.teamName} 로고`}
                            />
                        ) : (
                            <span className="team-logo-fallback">
                                {targetGame.teamName}
                            </span>
                        )}
                    </div>

                    {/* 팀 이름 */}
                    <div className="team-name">
                        {targetGame.teamName}
                    </div>
                </div>


                {/* ============================================
                    VS
                ============================================= */}

                <div className="vs-text">
                    VS
                </div>


                {/* ============================================
                    AWAY TEAM
                ============================================= */}

                <div
                    className={`team-box ${
                        isFavoriteAway
                            ? 'favorite-team'
                            : ''
                    }`}
                >
                    {/* AWAY */}
                    <div className="home-away-label">
                        AWAY
                    </div>

                    {/* 로고 */}
                    <div className="team-logo">
                        {awayTeamLogo ? (
                            <img
                                src={awayTeamLogo}
                                alt={`${targetGame.opponentTeamName} 로고`}
                            />
                        ) : (
                            <span className="team-logo-fallback">
                                {targetGame.opponentTeamName}
                            </span>
                        )}
                    </div>

                    {/* 팀 이름 */}
                    <div className="team-name">
                        {targetGame.opponentTeamName}
                    </div>
                </div>
            </div>


            {/* ================================================
                경기 지표
            ================================================= */}

            <div className="metrics-container">

                {/* 승리 확률 */}
                <div className="metric-item">
                    <div className="metric-label">
                        승리 확률
                    </div>

                    <div className="metric-value red">
                        {(targetGame.winProbability * 100).toFixed(1)}%
                    </div>
                </div>


                {/* 직관 추천 점수 */}
                <div className="metric-item">
                    <div className="metric-label">
                        직관 추천 점수
                    </div>

                    <div className="metric-value green">
                        {targetGame.recommendationScore}점
                    </div>
                </div>


                {/* 추천 등급 */}
                <div className="metric-item">
                    <div className="metric-label">
                        추천 등급
                    </div>

                    <div className="metric-value light">
                        {targetGame.recommendationGrade} 등급
                    </div>
                </div>

            </div>


            {/* ================================================
                경기 분석 버튼
            ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setSelectedGameId(
                        String(targetGame.gameId)
                    )
                }
                className="analysis-button"
            >
                <span>
                    경기 분석 자세히 보기
                </span>

                <span>
                    →
                </span>
            </button>


            {/* ================================================
                경기 분석 모달
            ================================================= */}

            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() =>
                    setSelectedGameId(null)
                }
            />

        </div>
    );
}
