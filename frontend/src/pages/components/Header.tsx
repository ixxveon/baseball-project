import React from 'react';
import type { HeaderProps } from '../../types';

export default function Header({ activeTab, onTabChange }: HeaderProps): React.JSX.Element {
    return (
        <header className="site-header">
            <div className="header-inner">
                <button type="button" className="brand" onClick={() => onTabChange('home')}>
                    <span className="brand-main">위닝</span>
                    <span className="brand-sub">PICK</span>
                </button>

                <nav className="tabs">
                    <button type="button" className={`tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => onTabChange('home')}>홈</button>
                    <button type="button" className={`tab ${activeTab === 'recommend' ? 'active' : ''}`} onClick={() => onTabChange('recommend')}>직관 추천</button>
                    <button type="button" className={`tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => onTabChange('analysis')}>경기 분석</button>
                    <button type="button" className={`tab ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => onTabChange('ranking')}>랭킹</button>
                    <button type="button" className={`tab ${activeTab === 'community' ? 'active' : ''}`} onClick={() => onTabChange('community')}>커뮤니티</button>
                </nav>

                <div className="user-area">
                    <button type="button" className="icon-btn">
                        🔔
                        <span className="notification-badge">3</span>
                    </button>
                    <button type="button" className="user-profile-btn">
                        <span>👤</span>
                        <span>민형님 ▼</span>
                    </button>
                </div>
            </div>
        </header>
    );
}