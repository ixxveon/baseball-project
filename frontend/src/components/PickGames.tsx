import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GameCard from './GameCard';
import AnalysisScreen from './AnalysisScreen';
import { fetchUpcomingGames } from '../api/gamesApi';

export default function PickGames(): React.JSX.Element {
    const { data: games = [], isLoading, isError } = useQuery({
        queryKey: ['upcomingGames'],
        queryFn: fetchUpcomingGames,
    });
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    return (
        <section className="pick-section">
            <div className="section-title">
                <h2>이번 달 직관 추천 경기</h2>
            </div>

            {isLoading && <p>불러오는 중...</p>}
            {isError && <p>경기 목록을 불러오는 데 실패했습니다.</p>}

            <div className="game-grid-container">
                {games.map((game) => (
                    <GameCard
                        key={game.gameId}
                        game={game}
                        onClick={(gameId) => setSelectedGameId(String(gameId))}
                    />
                ))}
            </div>

            <AnalysisScreen
                gameId={selectedGameId}
                onClose={() => setSelectedGameId(null)}
            />
        </section>
    );
}