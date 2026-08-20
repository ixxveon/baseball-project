import React, { useState } from 'react';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import RecommendScreen from './pages/RecommendScreen';
import LoginPage from './pages/LoginPage';
import RankingPage from './pages/RankingPage';
import type { TabType } from './types';

export default function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabType>('home');

    return (
        <div className="dashboard-container">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="dashboard-main">
                {/* 1. 홈 화면 */}
                {activeTab === 'home' && <HomeScreen />}

                {/* 2. 직관추천 화면 */}
                {activeTab === 'recommend' && <RecommendScreen />}

                {/* 3. 랭킹 화면 */}
                {activeTab === 'ranking' && <RankingPage />}

                {/* 4. 로그인 화면 */}
                {activeTab === 'login' && <LoginPage />}

                {/* 5. 기타 메뉴 준비 중 표시 */}
                {activeTab !== 'home' && activeTab !== 'recommend' && activeTab !== 'login' && activeTab !== 'ranking' &&(
                    <div className="tab-placeholder" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                        <h2>{activeTab} 페이지 준비 중입니다.</h2>
                    </div>
                )}
            </main>
        </div>
    );
}