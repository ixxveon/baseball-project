import React from 'react';
import { GRADE_COLORS, RecommendationGrade } from '../constants/grade';

export interface RecommendedGame {
    id: number;
    homeTeam: string;
    awayTeam: string;
    grade: RecommendationGrade;
}

// Props로 데이터를 받거나, API state로 가져오는 상황 예시
interface RecommendScreenProps {
    games?: RecommendedGame[];
}

export const RecommendScreen: React.FC<RecommendScreenProps> = ({ games = [] }) => {

    return (
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
            {/* 4열 반응형 그리드 */}
            <div className="recommend-grid">
                {games.map((game: RecommendedGame) => {
                    const colorInfo = GRADE_COLORS[game.grade];

                    return (
                        <div
                            key={game.id}
                            style={{
                                backgroundColor: colorInfo?.bg,
                                borderColor: colorInfo?.border,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderRadius: '8px',
                                padding: '16px',
                            }}
                        >
                            <span>{game.grade}등급</span>
                            <div>{game.homeTeam} vs {game.awayTeam}</div>
                        </div>
                    );
                })}
            </div>

            {/* 캘린더 반응형 그리드 */}
            <div className="calendar-grid">
            </div>
        </div>
    );
};

export default RecommendScreen;
