import React from 'react';

interface AiSummaryProps {
    onOpenModal?: () => void;
}

export default function AiSummary({ onOpenModal }: AiSummaryProps): React.JSX.Element {
    return (
        <div className="ai-summary-card" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            height: '100%'
        }}>
            <div>
                {/* 상단 타이틀 */}
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🤖</span> AI 분석 요약
                </h3>

                {/* 리스트 아이템 4개 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                            👤 선발 투수 우세
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                            LG 선발 투수의 최근 3경기 ERA가 2.45로 두산 선발(4.31)보다 우세합니다.
                        </p>
                    </div>

                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                            ✏️ 타선 흐름 우세
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                            LG의 최근 5경기 팀 OPS가 0.812로 두산(0.721)보다 좋습니다.
                        </p>
                    </div>

                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                            🏠 홈 경기 이점
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                            LG는 잠실야구장에서 올 시즌 68%의 승률을 기록 중입니다.
                        </p>
                    </div>

                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                            ☀️ 날씨 분석
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                            맑고 기온 28℃, 바람 2m/s로 야구 관람에 최적의 날씨입니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 하단 채우기 영역: AI 종합 총평 + 모달 버튼 */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    color: '#334155',
                    fontWeight: '600',
                    lineHeight: '1.4'
                }}>
                    💡 <span style={{ color: '#e11d48', fontWeight: '800' }}>AI 종합:</span> 홈 이점과 선발 우세로 LG 승리가 매우 유력한 경기입니다.
                </div>

                {onOpenModal && (
                    <button
                        type="button"
                        onClick={onOpenModal}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        AI 전력 분석 전체 보고서 보기 →
                    </button>
                )}
            </div>
        </div>
    );
}