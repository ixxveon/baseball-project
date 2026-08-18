import React from 'react';
import AiSummary from './AiSummary';

export default function RecommendedGames(): React.JSX.Element {
    return (
        <div className="hero-section-grid">
            <section className="hero-recommend-card">
                <div className="hero-header">
                    <span className="hero-badge">오늘의 추천 경기</span>
                    <span className="hero-date">2026.08.17 (월) 18:30 | 잠실야구장</span>
                </div>

                <div className="hero-matchup">
                    <div className="hero-team">
                        <div className="team-logo lg">LG TWINS</div>
                        <span className="team-name">LG 트윈스</span>
                    </div>
                    <span className="vs-badge">VS</span>
                    <div className="hero-team">
                        <div className="team-logo doosan">DOOSAN BEARS</div>
                        <span className="team-name">두산 베어스</span>
                    </div>
                </div>

                <div className="hero-stats-row">
                    <div className="stat-box">
                        <span className="stat-label">LG 승리 확률</span>
                        <span className="stat-value highlight-red">68%</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-label">직관 추천 점수</span>
                        <span className="stat-value">
                            87점 <small className="score-grade grade-a">A</small>
                        </span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-label">예상 관중</span>
                        <span className="stat-value">22,000명</span>
                    </div>
                </div>

                <button type="button" className="hero-action-btn">
                    경기 분석 자세히 보기 &rarr;
                </button>
            </section>

            <AiSummary />
        </div>
    );
}