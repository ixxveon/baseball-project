import React, { useState } from 'react';
import AnalysisScreen from '../pages/AnalysisScreen';

export default function RecommendedGames(): React.JSX.Element {
    // 경기 분석 모달을 띄우기 위한 상태 변수 (null이면 닫힘, string이면 해당 경기 ID 모달 열림)
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    return (
        <div className="recommended-card" style={{
            backgroundColor: '#111827',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            boxSizing: 'border-box'
        }}>
            {/* 상단 안내 배지 & 날짜/장소 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <span style={{
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '800'
                }}>
                    오늘의 경기
                </span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                    2026.08.17 (월) 18:30 | 잠실야구장
                </span>
            </div>

            {/* 경기 팀 맞대결 프로필 정보 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '12px 0'
            }}>
                {/* 홈팀 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: '#c30452',
                        margin: '0 auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '13px',
                        color: '#ffffff',
                        border: '3px solid #1f2937'
                    }}>
                        LG 트윈스
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>LG 트윈스</div>
                </div>

                <div style={{ fontSize: '22px', fontWeight: '900', color: '#6b7280' }}>
                    VS
                </div>

                {/* 원정팀 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: '#131230',
                        margin: '0 auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '13px',
                        color: '#ffffff',
                        border: '3px solid #1f2937'
                    }}>
                        두산 베어스
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>두산 베어스</div>
                </div>
            </div>

            {/* 승리 확률 / 추천 점수 / 예상 관중 요약 지표 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '16px 0',
                borderTop: '1px solid #1f2937',
                marginBottom: '20px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px'
            }}>
                <div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>LG 트윈스 승리 확률</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#e11d48' }}>68%</div>
                </div>
                <div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>직관 추천 점수</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>87점 A</div>
                </div>
                <div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>예상 관중</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#f3f4f6' }}>22,000명</div>
                </div>
            </div>

            {/* 경기 분석 자세히 보기 버튼 */}
            <button
                type="button"
                onClick={() => setSelectedGameId('20260817_LG_OB')}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s ease'
                }}
            >
                <span>경기 분석 자세히 보기</span>
                <span>→</span>
            </button>

            {/* 경기 분석 모달/PiP (selectedGameId가 담기면 팝업 출력) */}
            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() => setSelectedGameId(null)}
            />
        </div>
    );
}