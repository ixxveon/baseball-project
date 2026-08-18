const items = [
    {
        icon: "⚾",
        title: "선발 투수 우세",
        text: "LG 선발 투수의 최근 3경기 ERA가 2.45로 두산 선발(4.31)보다 우세합니다.",
    },
    {
        icon: "✏️",
        title: "타선 흐름 우세",
        text: "LG의 최근 5경기 팀 OPS가 0.812로 두산(0.721)보다 좋습니다.",
    },
    {
        icon: "🏠",
        title: "홈 경기 이점",
        text: "LG는 잠실야구장에서 올 시즌 68%의 승률을 기록 중입니다.",
    },
    {
        icon: "☀️",
        title: "날씨 분석",
        text: "맑고 기온 28°C, 바람 2m/s로 야구 관람에 최적의 날씨입니다.",
    },
];

export default function AiSummary() {
    return (
        <section className="box ai-summary">
            <div className="box-title">
                <h2>AI 분석 요약</h2>
                <button>더보기 ›</button>
            </div>

            {items.map((item) => (
                <div
                    className="ai-item"
                    key={item.title}
                >
                    <div className="ai-icon">
                        {item.icon}
                    </div>

                    <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}