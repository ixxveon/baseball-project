const links = [
    {
        name: "티켓링크",
        logo: "TL",
        className: "ticketlink",
    },
    {
        name: "인터파크 티켓",
        logo: "INT",
        className: "interpark",
    },
    {
        name: "LG 트윈스 예매",
        logo: "TWINS",
        className: "twins",
    },
    {
        name: "멜론티켓",
        logo: "melon",
        className: "melon",
    },
];

export default function ReservationsLinks() {
    return (
        <section className="box reservation-box">
            <h2>예매 바로가기</h2>

            <div className="reservation-list">
                {links.map((link) => (
                    <button
                        className="reservation"
                        key={link.name}
                    >
                        <b className={link.className}>
                            {link.logo}
                        </b>

                        <span>{link.name}</span>

                        <i>↗</i>
                    </button>
                ))}
            </div>
        </section>
    );
}