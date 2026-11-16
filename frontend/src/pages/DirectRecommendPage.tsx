import React from 'react';
import DirectRecommendCalendar from '../components/DirectRecommendCalendar';

export const DirectRecommendPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 py-8 px-4">
            <DirectRecommendCalendar />
        </div>
    );
};

export default DirectRecommendPage;