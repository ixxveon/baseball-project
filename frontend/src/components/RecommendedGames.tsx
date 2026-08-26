import React, { useState } from 'react';
import AnalysisScreen from '../pages/AnalysisScreen';
import { gamesData } from '../data/games'; // 기존 목업 데이터 연동

export default function RecommendedGames(): React.JSX.Element {
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    // 목업 데이터 중 첫 번째 경기 매칭
    const targetGame = gamesData[0];

    return (
        <div className="hero-recommend-card">
            {/* 상단 헤더 배지 & 날짜 */}
            <div className="hero-header">
                <span className="hero-badge">오늘의 경기</span>
                <span className="hero-date">{targetGame.date} | {targetGame.stadium}</span>
            </div>

            {/* 팀 맞대결 매치업 정보 */}
            <div className="hero-matchup">
                <div className="hero-team">
                    <div className="team-logo lg">{targetGame.team1}</div>
                    <span className="team-name">{targetGame.team1}</span>
                </div>

                <div className="vs-badge">VS</div>

                <div className="hero-team">
                    <div className="team-logo doosan">{targetGame.team2}</div>
                    <span className="team-name">{targetGame.team2}</span>
                </div>
            </div>

            {/* 하단 스탯 지표 행 */}
            <div className="hero-stats-row">
                <div className="stat-box">
                    <span className="stat-label">{targetGame.team1} 승리 확률</span>
                    <span className="stat-value highlight-red">{targetGame.winRate}</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                    <span className="stat-label">직관 추천 점수</span>
                    <span className="stat-value">
                        {targetGame.score} <span className="score-grade grade-a">{targetGame.grade}</span>
                    </span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                    <span className="stat-label">추천 태그</span>
                    <span className="stat-value" style={{ fontSize: '14px' }}>{targetGame.tag}</span>
                </div>
            </div>

            {/* 분석 자세히 보기 버튼 */}
            <button
                type="button"
                onClick={() => setSelectedGameId(String(targetGame.id))}
                className="hero-action-btn"
            >
                경기 분석 자세히 보기 →
            </button>

            {/* 분석 모달 */}
            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() => setSelectedGameId(null)}
            />
        </div>
    );
}