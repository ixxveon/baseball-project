import React, { useEffect, useState } from 'react';
import { fetchGameAnalysis, GameAnalysisData } from '../api/analysisApi';

interface AnalysisScreenProps {
    gameId: string | null;
    onClose: () => void;
}

export default function AnalysisScreen({ gameId, onClose }: AnalysisScreenProps): React.JSX.Element | null {
    const [data, setData] = useState<GameAnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        setLoading(true);
        setError(null);

        fetchGameAnalysis(gameId)
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || '데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            });
    }, [gameId]);

    if (!gameId) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                width: '90%',
                maxWidth: '640px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                position: 'relative',
                maxHeight: '85vh',
                overflowY: 'auto'
            }}>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}
                >
                    ✕
                </button>

                <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                    🤖 AI 경기 심층 분석
                </h2>

                {loading && (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                        AI가 최근 데이터 및 예측 모델을 분석 중입니다...
                    </div>
                )}

                {error && (
                    <div style={{ padding: '20px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && data && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            backgroundColor: '#f8fafc',
                            padding: '16px',
                            borderRadius: '12px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>예상 승률</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#e11d48' }}>{data.winRate}%</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>예상 스코어</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{data.scorePredict}</div>
                            </div>
                        </div>

                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                            <p><strong>⚾ 선발 투수 분석:</strong> {data.summary.pitcherComparison}</p>
                            <p><strong>🏏 타선 흐름:</strong> {data.summary.battingComparison}</p>
                            <p><strong>🏟️ 구장 및 홈 이점:</strong> {data.summary.homeAdvantage}</p>
                            <p><strong>☀️ 날씨 영향:</strong> {data.summary.weatherImpact}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}