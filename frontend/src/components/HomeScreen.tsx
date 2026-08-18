import React from 'react';
import RecommendedGames from './RecommendedGames';
import PickGames from './PickGames';
import Calendar from './Calendar';
import RecentSummary from './RecentSummary';
import ReservationsLinks from './ReservationsLinks';
import NoticeBoard from './NoticeBoard';

export default function HomeScreen(): React.JSX.Element {
    return (
        <>
            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>안녕하세요, 민형님! 👋</h1>
                    <p>LG 트윈스의 승리를 위닝PICK이 함께 예측합니다!</p>
                </div>
                <div className="my-team-selector">
                    <span className="star-icon">★</span>
                    <span className="label">내 응원팀</span>
                    <select defaultValue="LG">
                        <option value="LG">LG 트윈스</option>
                        <option value="두산">두산 베어스</option>
                        <option value="삼성">삼성 라이온즈</option>
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <RecommendedGames />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <PickGames />
            </div>

            <div className="dashboard-grid">
                <div className="main-content-column">
                    <Calendar />
                    <RecentSummary />
                </div>

                <div className="sidebar-column">
                    <div className="alarm-box">
                        <div className="alarm-header">
                            <h3>티켓 오픈 알림 설정</h3>
                            <button type="button" className="text-btn">설정하기 &rsaquo;</button>
                        </div>
                        <p>티켓 오픈 1시간 전 / 10분 전 알림을 받아보세요!</p>
                        <div className="bell-icon-large">🔔</div>
                    </div>

                    <ReservationsLinks />
                    <NoticeBoard />
                </div>
            </div>
        </>
    );
}