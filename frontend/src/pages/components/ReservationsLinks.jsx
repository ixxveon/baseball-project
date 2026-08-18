import { ExternalLink } from "lucide-react";

const links = [
    ["tl", "티켓링크"],
    ["INT", "인터파크 티켓"],
    ["TWINS", "LG 트윈스 예매"],
    ["melon", "멜론티켓"],
];

export default function ReservationLinks() {
    return (
        <div className="white-box reservation">
            <h2>예매 바로가기</h2>

            <div className="reservation-list">
                {links.map(([logo, name]) => (
                    <button key={name}>
            <span className={`reservation-logo ${logo}`}>
              {logo}
            </span>

                        <span>{name}</span>

                        <ExternalLink size={16} />
                    </button>
                ))}
            </div>
        </div>
    );
}