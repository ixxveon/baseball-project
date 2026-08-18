import React from 'react';

export default function PickGames() {
    const games = [
        {
            id: 1,
            date: "08.18 (화) 18:30",
            team1: "LG",
            team2: "KT",
            stadium: "잠실야구장",
            winRate: "75%",
            score: "82점",
            tag: "추천",
            stars: "★★★★☆",
            selected: false,
            grade: "A"
        },
        {
            id: 2,
            date: "08.21 (금) 18:30",
            team1: "삼성",
            team2: "LG",
            stadium: "잠실야구장",
            winRate: "88%",
            score: "92점",
            tag: "강력 추천",
            stars: "★★★★★",
            selected: true,
            grade: "S"
        },
        {
            id: 3,
            date: "08.25 (화) 18:30",
            team1: "SSG",
            team2: "LG",
            stadium: "잠실야구장",
            winRate: "60%",
            score: "75점",
            tag: "보통",
            stars: "★★★☆☆",
            selected: false,
            grade: "B"
        },
        {
            id: 4,
            date: "08.28 (금) 18:30",
            team1: "NC",
            team2: "LG",
            stadium: "잠실야구장",
            winRate: "45%",
            score: "65점",
            tag: "낮음",
            stars: "★★☆☆☆",
            selected: false,
            grade: "C"
        },
    ];

    return (
        <section className="pick-section">
            <div className="section-title">
                <h2>이번 달 직관 추천 경기</h2>
                <button className="more-btn">전체 보기 &rsaquo;</button>
            </div>

            <div className="game-grid-container">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={`match-card ${game.selected ? 'is-selected' : ''}`}
                    >
                        <div className="match-card-header">
                            <span className="match-date">{game.date}</span>
                            <span className={`grade-badge-circle grade-${game.grade.toLowerCase()}`}>
                                {game.grade}
                            </span>
                        </div>

                        <div className="match-card-body">
                            <div className="teams-row">
                                <span className="home-team">{game.team1}</span>
                                <span className="vs-label">VS</span>
                                <span className="away-team">{game.team2}</span>
                            </div>
                            <div className="stadium-row">
                                📍 {game.stadium}
                            </div>
                        </div>

                        <div className="match-card-footer">
                            <div className="score-info">
                                <strong className="score-text">{game.score}</strong>
                                <span className="tag-text">{game.tag}</span>
                            </div>
                            <div className="stars-text">{game.stars}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}