import React, { useEffect, useState } from 'react';
import GameCard from './GameCard';
import AnalysisScreen from './AnalysisScreen';
import { fetchUpcomingGames, UpcomingGame } from '../api/gamesApi';

export default function PickGames(): React.JSX.Element {
    const [games, setGames] = useState<UpcomingGame[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    useEffect(() => {
        fetchUpcomingGames()
            .then((result) => {
                setGames(result);
                setLoading(false);
            })
            .catch(() => {
                setError('경기 목록을 불러오는 데 실패했습니다.');
                setLoading(false);
            });
    }, []);

    return (
        <section className="pick-section">
            <div className="section-title">
                <h2>이번 달 직관 추천 경기</h2>
            </div>

            {loading && <p>불러오는 중...</p>}
            {error && <p>{error}</p>}

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