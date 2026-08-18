import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <div className="logo">
                    <div className="logo-ball">⚾</div>
                    <span>PLAYBALL</span>
                    <b>PICK</b>
                </div>

                <nav>
                    <a className="active">홈</a>
                    <a>직관 추천</a>
                    <a>경기 분석</a>
                    <a>랭킹</a>
                    <a>커뮤니티</a>
                </nav>

                <div className="header-right">
                    <div className="notification">
                        <Bell size={22} />
                        <span>3</span>
                    </div>

                    <div className="profile">
                        <div className="avatar">👨🏻</div>
                        <strong>민형님</strong>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
}