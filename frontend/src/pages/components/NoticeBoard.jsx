import { ChevronRight } from "lucide-react";

const notices = [
    ["[안내] 2026년 하반기 경기 일정 안내", "08.10"],
    ["[안내] 티켓 예매처 점검 시간 안내", "08.08"],
    ["[업데이트] AI 분석 모델 업데이트 완료", "08.05"],
];

export default function NoticeBoard() {
    return (
        <div className="white-box notices">
            <div className="box-title">
                <h2>공지사항</h2>
                <button>
                    더보기 <ChevronRight size={16} />
                </button>
            </div>

            {notices.map(([title, date]) => (
                <div className="notice" key={title}>
                    <span>{title}</span>
                    <time>{date}</time>
                </div>
            ))}
        </div>
    );
}