import React, { useState, useEffect } from 'react';

export interface GameSummary {
    pitcherComparison: string;
    battingComparison: string;
    homeAdvantage: string;
    headToHead: string;
    keyPlayer: string;
    weatherComment: string;
}

export interface CalendarGame {
    gameId: number;
    matchDate: string;
    matchTime: string;
    homeTeamName: string;
    awayTeamName: string;
    myTeamScore: number;
    myTeamWinProb: number;
    weatherCondition: string;
    isRain: boolean;
    temperature?: number;
    weatherAdjustment: number;
    scorePredict?: string;
    summary?: GameSummary;
}

const KBO_TEAMS = ['KIA', 'LG', '두산', 'KT', 'SSG', 'NC', '한화', '롯데', '삼성', '키움'];

export const DirectRecommendCalendar: React.FC = () => {
    const [selectedTeam, setSelectedTeam] = useState<string>('KIA');
    const [currentYearMonth, setCurrentYearMonth] = useState<string>('2026-08');
    const [games, setGames] = useState<Record<string, CalendarGame>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<CalendarGame | null>(null);

    useEffect(() => {
        void fetchCalendarData();
    }, [selectedTeam, currentYearMonth]);

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/v1/calendar/recommendations?teamName=${selectedTeam}&yearMonth=${currentYearMonth}`
            );
            const data: CalendarGame[] = await response.json();

            const gameMap: Record<string, CalendarGame> = {};
            data.forEach((game) => {
                gameMap[game.matchDate] = game;
            });
            setGames(gameMap);
        } catch (error) {
            console.error('직관 추천 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrafficLightStyle = (score: number) => {
        if (score >= 60) return { bg: '#10b981', color: '#ffffff' };
        if (score >= 45) return { bg: '#f59e0b', color: '#ffffff' };
        return { bg: '#ef4444', color: '#ffffff' };
    };

    const renderDays = () => {
        const [year, month] = currentYearMonth.split('-').map(Number);
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        const days = [];

        // 빈 날짜 셀
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} style={{ height: '140px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }} />
            );
        }

        // 일자 셀
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const game = games[dateStr];

            days.push(
                <div
                    key={dateStr}
                    onClick={() => game && setSelectedGame(game)}
                    style={{
                        height: '140px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: game ? 'pointer' : 'default',
                        boxSizing: 'border-box',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{day}</span>
                        {game?.isRain && (
                            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 'bold' }}>☔ 우천</span>
                        )}
                    </div>

                    {game ? (
                        (() => {
                            const isHome = game.homeTeamName === selectedTeam;
                            const opponent = isHome ? game.awayTeamName : game.homeTeamName;
                            const style = getTrafficLightStyle(game.myTeamScore);

                            return (
                                <div
                                    style={{
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '10px',
                                        padding: '8px 10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '95px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                      <span style={{ color: '#64748b', fontWeight: 'normal' }}>{isHome ? 'VS' : '@'}</span> {opponent}
                    </span>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                padding: '2px 7px',
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                backgroundColor: style.bg,
                                                color: style.color,
                                            }}
                                        >
                      {game.myTeamScore}점
                    </span>
                                    </div>

                                    <div style={{ fontSize: '11px', color: '#334155' }}>
                                        승률: <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{game.myTeamWinProb}%</span>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '10px',
                                            color: '#64748b',
                                            borderTop: '1px solid #e2e8f0',
                                            paddingTop: '5px',
                                        }}
                                    >
                                        <span>{game.weatherCondition}</span>
                                        {game.weatherAdjustment !== 0 && (
                                            <span style={{ color: game.weatherAdjustment < 0 ? '#dc2626' : '#059669', fontWeight: 'bold' }}>
                        날씨 {game.weatherAdjustment > 0 ? `+${game.weatherAdjustment}` : game.weatherAdjustment}
                      </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: 'auto 0' }}>
                            경기 없음
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div
            style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '28px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* 상단 헤더 영역 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                        🏟️ AI 직관 추천 캘린더
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                        팀 승률과 날씨 보정치(-90~+5점)가 반영된 종합 추천 지수입니다.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        style={{
                            backgroundColor: '#f8fafc',
                            color: '#0f172a',
                            fontSize: '14px',
                            fontWeight: 600,
                            padding: '9px 16px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        {KBO_TEAMS.map((team) => (
                            <option key={team} value={team}>
                                {team}
                            </option>
                        ))}
                    </select>

                    <input
                        type="month"
                        value={currentYearMonth}
                        onChange={(e) => setCurrentYearMonth(e.target.value)}
                        style={{
                            backgroundColor: '#f8fafc',
                            color: '#0f172a',
                            fontSize: '14px',
                            fontWeight: 600,
                            padding: '9px 16px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* 캘린더 달력 Grid */}
            {loading ? (
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
                    데이터를 불러오는 중입니다...
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '1px',
                        backgroundColor: '#cbd5e1',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #cbd5e1',
                    }}
                >
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <div
                            key={day}
                            style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: 800,
                                backgroundColor: '#f1f5f9',
                                color: idx === 0 ? '#dc2626' : idx === 6 ? '#2563eb' : '#334155',
                            }}
                        >
                            {day}
                        </div>
                    ))}
                    {renderDays()}
                </div>
            )}

            {/* AI 상세 분석 모달 */}
            {selectedGame && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 50,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '24px',
                            padding: '28px',
                            maxWidth: '500px',
                            width: '100%',
                            position: 'relative',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <button
                            onClick={() => setSelectedGame(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 4px 0', color: '#0f172a' }}>
                            {selectedGame.homeTeamName} vs {selectedGame.awayTeamName}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
                            {selectedGame.matchDate} 경기 AI 리포트
                        </p>

                        {selectedGame.summary ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                                <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontWeight: 'bold', color: '#059669' }}>⚾ 선발 투수:</span> {selectedGame.summary.pitcherComparison}
                                </div>
                                <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontWeight: 'bold', color: '#059669' }}>🏏 타선 분석:</span> {selectedGame.summary.battingComparison}
                                </div>
                                <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontWeight: 'bold', color: '#d97706' }}>🌤️ 날씨 요약:</span> {selectedGame.summary.weatherComment}
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '13px', color: '#94a3b8', padding: '20px 0', textAlign: 'center' }}>
                                상세 분석 내용이 아직 준비되지 않았습니다.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectRecommendCalendar;