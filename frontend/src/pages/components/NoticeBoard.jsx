const notices = [
    {
        title: "[안내] 2026년 하반기 경기 일정 안내",
        date: "08.10",
    },
    {
        title: "[안내] 티켓 예매처 점검 시간 안내",
        date: "08.08",
    },
    {
        title: "[업데이트] AI 분석 모델 업데이트 완료",
        date: "08.05",
    },
];

export default function NoticeBoard() {
    return (
        <section className="box notice-box">
            <div className="box-title">
                <h2>공지사항</h2>
                <button>더보기 ›</button>
            </div>

            <div className="notice-list">
                {notices.map((notice) => (
                    <div
                        className="notice"
                        key={notice.title}
                    >
                        <span>{notice.title}</span>
                        <small>{notice.date}</small>
                    </div>
                ))}
            </div>
        </section>
    );
}