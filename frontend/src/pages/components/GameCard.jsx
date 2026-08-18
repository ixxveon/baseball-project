import { MapPin, Star } from "lucide-react";

export default function GameCard({ game }) {
    return (
        <div className={`game-card ${game.selected ? "selected" : ""}`}>
            <div className="game-card-top">
                <strong>{game.date}</strong>
                <span className={`grade ${game.color}`}>{game.grade}</span>
            </div>

            <div className="matchup">
                <div className="small-team">
                    <div className="mini-logo lg">LG</div>
                </div>

                <b>VS</b>

                <div className="small-team">
                    <div className={`mini-logo opponent ${game.color}`}>
                        {game.opponent.split(" ")[0]}
                    </div>
                </div>
            </div>

            <div className="location">
                <MapPin size={15} />
                잠실야구장
            </div>

            <div className="game-card-bottom">
                <strong>{game.score}<small>점</small></strong>
                <span>{game.label}</span>

                <div className="stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                            key={n}
                            size={16}
                            fill={n <= Math.round(game.score / 20) ? "#ffae00" : "none"}
                            color={n <= Math.round(game.score / 20) ? "#ffae00" : "#aab1bd"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}