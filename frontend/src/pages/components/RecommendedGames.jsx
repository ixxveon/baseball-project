import { ChevronRight } from "lucide-react";
import { games } from "../data/games";
import GameCard from "./GameCard";

export default function RecommendedGames() {
    return (
        <section className="recommended">
            <div className="section-title">
                <h2>이번 달 직관 추천 경기</h2>
                <button>
                    전체 보기 <ChevronRight size={16} />
                </button>
            </div>

            <div className="games-grid">
                {games.map((game) => (
                    <GameCard game={game} key={game.date} />
                ))}
            </div>
        </section>
    );
}