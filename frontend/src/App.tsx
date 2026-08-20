import React, { useState } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import RecommendScreen from './pages/RecommendScreen.tsx';
import LoginPage from './pages/LoginPage'; // LoginPage 경로 확인
import type { TabType } from './types';

export default function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabType>('home');

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* 상단 헤더 */}
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            {/* 메인 뷰 전환 처리 */}
            <main className="dashboard-main">
                {activeTab === 'login' ? (
                    <LoginPage onTabChange={setActiveTab} />
                ) : (
                    <>
                        {activeTab === 'home' && <HomeScreen />}
                        {activeTab === 'recommend' && <RecommendScreen />}
                        {activeTab === 'ranking' && (
                            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                🏆 순위 페이지 준비 중입니다.
                            </div>
                        )}
                        {activeTab === 'community' && (
                            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                💬 커뮤니티 페이지 준비 중입니다.
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}