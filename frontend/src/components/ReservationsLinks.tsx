import React from 'react';

export default function ReservationsLinks(): React.JSX.Element {
    return (
        <div className="reservation-box">
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "16px" }}>
                예매 바로가기
            </h3>
            <div className="reservation-list">
                <div className="reservation">
                    <b className="ticketlink">TL</b>
                    <span>티켓링크 ↗</span>
                </div>
                <div className="reservation">
                    <b className="interpark">INT</b>
                    <span>인터파크 티켓 ↗</span>
                </div>
                <div className="reservation">
                    <b className="twins">TWINS</b>
                    <span>LG 트윈스 예매 ↗</span>
                </div>
                <div className="reservation">
                    <b className="melon">melon</b>
                    <span>멜론티켓 ↗</span>
                </div>
            </div>
        </div>
    );
}