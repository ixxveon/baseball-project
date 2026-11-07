import React from 'react';
import { TEAM_LOGOS } from '../constants/teamLogos';

interface TeamReservation {
    name: string;
    url: string;
}

const TEAM_RESERVATIONS: TeamReservation[] = [
    { name: 'LG 트윈스', url: 'https://www.ticketlink.co.kr/sports/137/59' },
    { name: '두산 베어스', url: 'https://nol.yanolja.com/ticket/genre/sports/bears' },
    { name: 'KT 위즈', url: 'https://www.ticketlink.co.kr/sports/137/62' },
    { name: 'SSG 랜더스', url: 'https://www.ssglanders.com/game/ticket' },
    { name: 'NC 다이노스', url: 'https://ticket.ncdinos.com/' },
    { name: '삼성 라이온즈', url: 'https://www.ticketlink.co.kr/sports/137/57' },
    { name: '롯데 자이언츠', url: 'https://ticket.giantsclub.com/loginForm.do' },
    { name: '한화 이글스', url: 'https://www.ticketlink.co.kr/sports/137/63' },
    { name: 'KIA 타이거즈', url: 'https://www.ticketlink.co.kr/sports/137/58' },
    { name: '키움 히어로즈', url: 'https://nol.yanolja.com/ticket/genre/sports/heroes' },
];

export default function ReservationsLinks(): React.JSX.Element {
    return (
        <div className="reservation-box">
            <h3 className="reservation-box-title">예매 바로가기</h3>
            <div className="reservation-list">
                {TEAM_RESERVATIONS.map((team) => (
                    <a
                        key={team.name}
                        className="reservation-logo-only"
                        href={team.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${team.name} 예매`}
                    >
                        {TEAM_LOGOS[team.name] ? (
                            <img
                                src={TEAM_LOGOS[team.name]}
                                alt={`${team.name} 예매`}
                            />
                        ) : (
                            team.name.slice(0, 2)
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
}