const weeks = [
    ["26", "27", "28", "29", "30", "31", "1"],
    ["2", "3", "4", "5", "6", "7", "8"],
    ["9", "10", "11", "12", "13", "14", "15"],
    ["16", "17", "18", "19", "20", "21", "22"],
    ["23", "24", "25", "26", "27", "28", "29"],
    ["30", "31", "1", "2", "3", "4", "5"],
];

export default function Calendar() {
    return (
        <div className="white-box calendar-box">
            <div className="section-title">
                <h2>2026년 8월 직관 캘린더</h2>
            </div>

            <div className="calendar">
                <div className="week header-row">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {weeks.map((week, weekIndex) => (
                    <div className="week" key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            const event =
                                day === "17"
                                    ? "두산"
                                    : day === "18"
                                        ? "KT"
                                        : day === "21"
                                            ? "삼성"
                                            : day === "25"
                                                ? "SSG"
                                                : day === "28"
                                                    ? "NC"
                                                    : null;

                            return (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={[
                                        "day",
                                        day === "17" ? "strong-event" : "",
                                        day === "18" ? "green-event" : "",
                                        day === "21" ? "strong-event" : "",
                                        day === "25" ? "blue-event" : "",
                                        day === "28" ? "yellow-event" : "",
                                    ].join(" ")}
                                >
                                    <span>{day}</span>

                                    {event && (
                                        <div className="calendar-event">
                                            {event}
                                            <small>
                                                {day === "17"
                                                    ? "A 87"
                                                    : day === "21"
                                                        ? "S 92"
                                                        : day === "25"
                                                            ? "B 75"
                                                            : day === "28"
                                                                ? "C 65"
                                                                : "A 82"}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="calendar-legend">
                <span><i className="red-dot" /> 강력 추천</span>
                <span><i className="green-dot" /> 추천</span>
                <span><i className="blue-dot" /> 보통</span>
                <span><i className="yellow-dot" /> 낮음</span>
                <span><i className="gray-dot" /> 경기 없음</span>
            </div>
        </div>
    );
}