import React from 'react';
import RecommendedGames from './RecommendedGames';
import AiSummary from './todayAiSummary';
import RecentSummary from './RecentSummary';
import ReservationsLinks from './ReservationsLinks';
import NoticeBoard from './NoticeBoard';

export default function HomeScreen(): React.JSX.Element {
    return (
        <div className="home-container" style={{
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            padding: '32px 40px',
            boxSizing: 'border-box'
        }}>
            {/* 상단 프로필 & 공지사항 바 */}
            <div className="welcome-section" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <div className="welcome-text" style={{ flexShrink: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                        안녕하세요, 민형님! 👋
                    </h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        LG 트윈스의 승리를 위닝PICK이 함께 예측합니다!
                    </p>
                </div>

                <div className="header-notice-wrapper" style={{
                    flex: 1,
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '0 20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    boxSizing: 'border-box'
                }}>
                    <NoticeBoard />
                </div>

                <div className="my-team-selector" style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                    <span className="star-icon" style={{ color: '#e11d48' }}>★</span>
                    <span className="label" style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>내 응원팀</span>
                    <select defaultValue="LG" style={{
                        border: 'none',
                        background: 'transparent',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#0f172a',
                        cursor: 'pointer',
                        outline: 'none'
                    }}>
                        <option value="LG">LG 트윈스</option>
                        <option value="두산">두산 베어스</option>
                        <option value="삼성">삼성 라이온즈</option>
                    </select>
                </div>
            </div>

            {/* 메인 2열 그리드 섹션 (좌측: 오늘의 경기 추천 / 우측: AI 분석 요약) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '24px',
                marginBottom: '32px',
                alignItems: 'stretch'
            }}>
                <RecommendedGames />
                <AiSummary />
            </div>

            {/* 하단 그리드 섹션 */}
            <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '24px'
            }}>
                <RecentSummary />
                <ReservationsLinks />
            </div>
        </div>
    );
}