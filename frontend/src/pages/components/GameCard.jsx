export default function GameCard({
                                     date,
                                     opponent,
                                     score,
                                     grade,
                                     active,
                                 }) {
    const team = opponent.split(" ")[0];

    return (
        <article
            className={`game-card ${
                active ? "selected" : ""
            }`}
        >
            <div className="game-card-top">
                <strong>{date}</strong>

                <span className={`grade grade-${grade}`}>
                    {grade}
                </span>
            </div>

            <div className="match">
                <strong>LG</strong>
                <span>VS</span>
                <b>{team}</b>
            </div>

            <div className="game-place">
                📍 잠실야구장
            </div>

            <div className="game-card-bottom">
                <div>
                    <strong>{score}</strong>
                    <small>점</small>
                </div>

                <span className="recommend">
                    {grade === "S"
                        ? "강력 추천"
                        : grade === "A"
                            ? "추천"
                            : grade === "B"
                                ? "보통"
                                : "낮음"}
                </span>

                <span className="stars">
                    ★★★★★
                </span>
            </div>
        </article>
    );
}