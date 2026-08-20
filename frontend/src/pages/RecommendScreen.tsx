import React, { useState } from "react";
import AnalysisScreen from "./AnalysisScreen";

interface RecommendedGameItem {
    id: string;
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    location: string;
    score: number;
    grade: 'S' | 'A' | 'B' | 'C';
    badgeText: string;
    stars: string;
    borderColor?: string;
    gradeBg: string;
}

export default function RecommendScreen(): React.JSX.Element {
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    // 상단 이번 달 직관 추천 경기 데이터
    const recommendedGames: RecommendedGameItem[] = [
        {
            id: "20260818_LG_KT",
            date: "08.18 (화)",
            time: "18:30",
            homeTeam: "LG",
            awayTeam: "KT",
            location: "잠실야구장",
            score: 82,
            grade: "A",
            badgeText: "추천",
            stars: "★★★★☆",
            gradeBg: "#10b981"
        },
        {
            id: "20260821_SSG_LG",
            date: "08.21 (금)",
            time: "18:30",
            homeTeam: "삼성",
            awayTeam: "LG",
            location: "잠실야구장",
            score: 92,
            grade: "S",
            badgeText: "강력 추천",
            stars: "★★★★★",
            borderColor: "#ef4444",
            gradeBg: "#ef4444"
        },
        {
            id: "20260825_SSG_LG",
            date: "08.25 (화)",
            time: "18:30",
            homeTeam: "SSG",
            awayTeam: "LG",
            location: "잠실야구장",
            score: 75,
            grade: "B",
            badgeText: "보통",
            stars: "★★★☆☆",
            gradeBg: "#3b82f6"
        },
        {
            id: "20260828_NC_LG",
            date: "08.28 (금)",
            time: "18:30",
            homeTeam: "NC",
            awayTeam: "LG",
            location: "잠실야구장",
            score: 65,
            grade: "C",
            badgeText: "낮음",
            stars: "★★☆☆☆",
            gradeBg: "#f59e0b"
        }
    ];

    return (
        <div className="recommend-screen-container" style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '32px 24px',
            boxSizing: 'border-box'
        }}>
            {/* 1. 상단 타이틀 */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🎫</span> 직관 추천 경기 & 캘린더
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                    AI가 분석한 승률 확률과 추천 점수로 이번 달 최고의 직관 경기를 찾아보세요!
                </p>
            </div>

            {/* 2. 이번 달 직관 추천 경기 섹션 */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                marginBottom: '32px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        이번 달 직관 추천 경기
                    </h2>
                    <button type="button" style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                        전체 보기 &gt;
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {recommendedGames.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => setSelectedGameId(game.id)}
                            style={{
                                border: game.borderColor ? `2px solid ${game.borderColor}` : '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                                    {game.date} {game.time}
                                </span>
                                <span style={{
                                    backgroundColor: game.gradeBg,
                                    color: '#ffffff',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: '800'
                                }}>
                                    {game.grade}
                                </span>
                            </div>

                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                                {game.homeTeam} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>VS</span> {game.awayTeam}
                            </div>
                            <div style={{ fontSize: '12px', color: '#e11d48', marginBottom: '16px' }}>
                                📍 {game.location}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <div>
                                    <span style={{ fontSize: '14px', fontWeight: '800', color: game.borderColor || '#0f172a' }}>
                                        {game.score}점
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
                                        {game.badgeText}
                                    </span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                                    {game.stars}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. 2026년 8월 직관 캘린더 섹션 */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        2026년 8월 직관 캘린더
                    </h2>
                    <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
                        <button type="button" style={{ border: 'none', padding: '4px 12px', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '12px', fontWeight: '700', color: '#0f172a', cursor: 'pointer' }}>월간 보기</button>
                        <button type="button" style={{ border: 'none', padding: '4px 12px', borderRadius: '4px', backgroundColor: 'transparent', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>목록 보기</button>
                    </div>
                </div>

                {/* 요일 헤더 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '700', fontSize: '12px', color: '#64748b', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#ef4444' }}>일</span>
                    <span>월</span>
                    <span>화</span>
                    <span>수</span>
                    <span>목</span>
                    <span>금</span>
                    <span>토</span>
                </div>

                {/* 캘린더 날짜 그리드 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
                    {/* 지난달 일부 */}
                    {[26, 27, 28, 29, 30, 31].map(d => (
                        <div key={`prev-${d}`} style={{ minHeight: '68px', padding: '6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: '#cbd5e1', fontSize: '12px' }}>{d}</div>
                    ))}

                    {/* 8월 1일 ~ 31일 */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                        let gameContent = null;

                        if (d === 4) gameContent = <div style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', fontWeight: 'bold' }}>vs KIA</div>;
                        if (d === 8) gameContent = <div style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', fontWeight: 'bold' }}>vs 키움</div>;
                        if (d === 17) gameContent = <div onClick={() => setSelectedGameId('20260817_LG_OB')} style={{ backgroundColor: '#fce7f3', color: '#be185d', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>vs 두산<br/>A 87</div>;
                        if (d === 18) gameContent = <div onClick={() => setSelectedGameId('20260818_LG_KT')} style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>vs KT<br/>A 82</div>;
                        if (d === 21) gameContent = <div onClick={() => setSelectedGameId('20260821_SSG_LG')} style={{ backgroundColor: '#ffe4e6', color: '#be123c', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>vs 삼성<br/>S 92</div>;
                        if (d === 25) gameContent = <div onClick={() => setSelectedGameId('20260825_SSG_LG')} style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>vs SSG<br/>B 75</div>;
                        if (d === 28) gameContent = <div onClick={() => setSelectedGameId('20260828_NC_LG')} style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '10px', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}>vs NC<br/>C 65</div>;

                        return (
                            <div key={`aug-${d}`} style={{ minHeight: '68px', padding: '6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#334155' }}>
                                <span>{d}</span>
                                {gameContent}
                            </div>
                        );
                    })}

                    {/* 다음달 일부 */}
                    {[1, 2, 3, 4, 5].map(d => (
                        <div key={`next-${d}`} style={{ minHeight: '68px', padding: '6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: '#cbd5e1', fontSize: '12px' }}>{d}</div>
                    ))}
                </div>

                {/* 하단 범례 */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>강력 추천</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>추천</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>보통</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>낮음</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></span>경기 없음</span>
                </div>
            </div>

            {/* 경기 상세 분석 모달 */}
            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() => setSelectedGameId(null)}
            />
        </div>
    );
}