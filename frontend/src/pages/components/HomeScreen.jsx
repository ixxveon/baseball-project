import React from 'react';
import MainRecommendSection from './MainRecommendSection';
import PickGames from './PickGames';
import CalendarSection from './CalendarSection';
import RecentSummarySection from './RecentSummarySection';
import SidebarSection from './SidebarSection';

export default function HomeScreen() {
    return (
        <div className="home-container">
            {/* 상단 웰컴 & 팀 선택 */}
            <div className="welcome-bar">
                <div className="welcome-text">
                    <h1>안녕하세요, 민형님! 👋</h1>
                    <p>LG 트윈스의 승리를 위닝PICK이 함께 예측합니다!</p>
                </div>
                <div className="team-select-box">
                    <span>★ 내 응원팀</span>
                    <select defaultValue="LG">
                        <option value="LG">LG 트윈스</option>
                        <option value="두산">두산 베어스</option>
                        <option value="삼성">삼성 라이온즈</option>
                    </select>
                </div>
            </div>

            {/* 최상단 2열 메인 섹션 */}
            <MainRecommendSection />

            {/* 이번 달 직관 추천 경기 */}
            <PickGames />

            {/* 하단 2열 메인 레이아웃 */}
            <div className="home-bottom-grid">
                <div className="left-column">
                    <CalendarSection />
                    <RecentSummarySection />
                </div>
                <div className="right-column">
                    <SidebarSection />
                </div>
            </div>
        </div>
    );
}