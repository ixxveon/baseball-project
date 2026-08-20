import React, { useState } from 'react';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import RecommendScreen from './pages/RecommendScreen';
import type { TabType } from './types';

export default function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabType>('home');

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* 상단 헤더 */}
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            {/* 메인 뷰 전환 처리 */}
            <main className="dashboard-main">
                {activeTab === 'home' && <HomeScreen />}
                {activeTab === 'recommend' && <RecommendScreen />}

                {activeTab !== 'home' && activeTab !== 'recommend' && (
                    <div className="tab-placeholder" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                        <h2>{activeTab} 페이지 준비 중입니다.</h2>
                    </div>
                )}
            </main>
        </div>
    );
}
