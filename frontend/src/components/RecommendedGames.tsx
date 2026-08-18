export default function RecommendedGames() {
    return (
        <div className="hero-section-grid">
            {/* 좌측: 오늘의 추천 경기 (다크 메인 카드) */}
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

                <button className="hero-action-btn">
                    경기 분석 자세히 보기 &rarr;
                </button>
            </section>

            {/* 우측: AI 분석 요약 카드 */}
            <section className="ai-summary-card">
                <div className="ai-header">
                    <h3>AI 분석 요약</h3>
                    <button className="more-btn">더보기 &rsaquo;</button>
                </div>

                <div className="ai-list">
                    <div className="ai-item">
                        <span className="ai-icon">👤</span>
                        <div className="ai-content">
                            <strong>선발 투수 우세</strong>
                            <p>LG 선발 투수의 최근 3경기 ERA가 2.45로 두산 선발(4.31)보다 우세합니다.</p>
                        </div>
                    </div>
                    <div className="ai-item">
                        <span className="ai-icon">✏️</span>
                        <div className="ai-content">
                            <strong>타선 흐름 우세</strong>
                            <p>LG의 최근 5경기 팀 OPS가 0.812로 두산(0.721)보다 좋습니다.</p>
                        </div>
                    </div>
                    <div className="ai-item">
                        <span className="ai-icon">🏠</span>
                        <div className="ai-content">
                            <strong>홈 경기 이점</strong>
                            <p>LG는 잠실야구장에서 올 시즌 68%의 승률을 기록 중입니다.</p>
                        </div>
                    </div>
                    <div className="ai-item">
                        <span className="ai-icon">☀️</span>
                        <div className="ai-content">
                            <strong>날씨 분석</strong>
                            <p>맑고 기온 28°C, 바람 2m/s로 야구 관람에 최적의 날씨입니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}