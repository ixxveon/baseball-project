import React from 'react';
import { GRADE_COLORS, RecommendationGrade } from '../constants/grade';

// 데이터 타입 정의 (I 접두사 금지 규칙 준수)[cite: 1]
export interface RecommendedGame {
    id: number;
    homeTeam: string;
    awayTeam: string;
    grade: RecommendationGrade;
}

export const RecommendScreen: React.FC = () => {
    // 예시 데이터
    const games: RecommendedGame[] = [
        { id: 1, homeTeam: 'LG', awayTeam: '두산', grade: 'S' },
        { id: 2, homeTeam: 'KIA', awayTeam: 'SSG', grade: 'A' },
    ];

    return (
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
            {/* 4열 반응형 그리드 */}
            <div className="recommend-grid">
                {games.map((game) => {
                    // grade로부터 색상 파생
                    const colorInfo = GRADE_COLORS[game.grade];

                    return (
                        <div
                            key={game.id}
                            style={{
                                backgroundColor: colorInfo.bg,
                                borderColor: colorInfo.border,
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
                {/* 캘린더 영역 */}
            </div>
        </div>
    );
};

export default RecommendScreen;