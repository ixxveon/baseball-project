import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import type { TabType } from './types';

export default function App(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabType>('home');

    return (
        <div className="dashboard-container">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="dashboard-main">
                {activeTab === 'home' ? (
                    <HomeScreen />
                ) : (
                    <div className="tab-placeholder">
                        <h2>{activeTab} 페이지 준비 중입니다.</h2>
                    </div>
                )}
            </main>
        </div>
    );
}
