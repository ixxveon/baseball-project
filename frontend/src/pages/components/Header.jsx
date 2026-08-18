import React from 'react';

export default function Header({ activeTab, onTabChange }) {
    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="brand" onClick={() => onTabChange('home')}>
                    <span className="brand-main">위닝</span>
                    <span className="brand-sub">PICK</span>
                </div>

                <nav className="tabs">
                    <button className={`tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => onTabChange('home')}>홈</button>
                    <button className={`tab ${activeTab === 'recommend' ? 'active' : ''}`} onClick={() => onTabChange('recommend')}>직관 추천</button>
                    <button className={`tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => onTabChange('analysis')}>경기 분석</button>
                    <button className={`tab ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => onTabChange('ranking')}>랭킹</button>
                    <button className={`tab ${activeTab === 'community' ? 'active' : ''}`} onClick={() => onTabChange('community')}>커뮤니티</button>
                </nav>

                <div className="user-area">
                    <button className="icon-btn">
                        🔔
                        <span className="notification-badge">3</span>
                    </button>
                    <div className="user-profile">
                        <span className="profile-img">👤</span>
                        <span className="user-name">민형님 ▼</span>
                    </div>
                </div>
            </div>
        </header>
    );
}