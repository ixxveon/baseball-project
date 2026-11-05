import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStats, mockHistory } from '../data/mockMyPage';
import { useMyInfo } from '../hooks/useMyInfo';
import { KBO_TEAMS } from '../constants/teams';

export default function MyPage(): React.JSX.Element {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const myInfo = useMyInfo();
    const favoriteTeamName = KBO_TEAMS.find((team) => team.id === myInfo?.favoriteTeamId)?.name;
    const joinDate = myInfo ? myInfo.createdAt.slice(0, 10).replace(/-/g, '.') : '-';

    const calculateWinRate = (wins: number, losses: number) => {
        const totalDecisions = wins + losses;
        if (totalDecisions === 0) return 0;
        return Math.round((wins / totalDecisions) * 100);
    };

    const winRate = calculateWinRate(mockStats.wins, mockStats.losses);

    const getBadgeInfo = (total: number, rate: number) => {
        if (total < 5) return { title: '직관 새싹', desc: '5경기 인증 시 배지가 부여돼요' };
        if (rate === 100) return { title: '무패 요정', desc: '직관 승률 100%' };
        if (rate >= 90) return { title: '초일류 승요', desc: '직관 승률 90% 이상' };
        if (rate >= 80) return { title: '엘리트 승요', desc: '직관 승률 80% 이상' };
        if (rate >= 70) return { title: '승리 요정', desc: '직관 승률 70% 이상' };
        if (rate < 30) return { title: '패배 요정', desc: '직관 승률 30% 미만' };
        return { title: '열혈 직관러', desc: '70% 넘으면 승리 요정' };
    };

    const badge = getBadgeInfo(mockStats.totalAttendances, winRate);

    // 이벤트 핸들러
    const handleGpsVerify = () => alert("GPS 위치 확인 중입니다...");
    const handleOcrClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) alert(`${file.name} 이미지를 분석 중입니다...`);
    };

    const handleEditProfile = () => {
        navigate('/profile-edit');
    };

    return (
        <div className="mypage-container">
            <style>
                {`
          .mypage-container { min-height: 100vh; padding: 32px 40px 80px; }
          .mypage-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 24px; align-items: start; }
          .mypage-main { display: flex; flex-direction: column; gap: 16px; }
          .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
          .card-title { font-size: 16px; font-weight: 700; color: #0f172a; }
          .card-desc { font-size: 13px; color: #64748b; margin-top: 4px; }

          .profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: #fef2f2; color: #b91c1c; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          .profile-name { font-size: 18px; font-weight: 700; color: #0f172a; }
          .profile-team { font-size: 14px; color: #64748b; margin-top: 2px; }
          .profile-meta { border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
          .meta-label { font-size: 12px; color: #94a3b8; }
          .meta-value { font-size: 14px; color: #0f172a; word-break: break-all; }
          .btn-secondary { width: 100%; margin-top: 20px; padding: 10px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 600; color: #334155; }
          .btn-secondary:hover { background: #f8fafc; }

          .stat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
          .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
          .stat-label { font-size: 13px; color: #64748b; margin-bottom: 6px; }
          .stat-value { font-size: 26px; font-weight: 800; color: #0f172a; }
          .stat-value.accent { color: #E6002D; }
          .stat-value.small { font-size: 18px; padding-top: 6px; }
          .stat-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }

          .verify-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .verify-buttons { display: flex; gap: 8px; }
          .btn-outline { padding: 10px 16px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 600; color: #334155; white-space: nowrap; }
          .btn-outline:hover { background: #f8fafc; }

          .history-list { margin-top: 12px; }
          .history-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-top: 1px solid #f1f5f9; }
          .history-game { font-size: 15px; font-weight: 600; color: #0f172a; }
          .history-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
          .history-result { font-size: 14px; font-weight: 700; }
          .history-result.win { color: #E6002D; }
          .history-result.lose { color: #94a3b8; }

          @media (max-width: 900px) {
            .mypage-container { padding: 24px 16px 80px; }
            .mypage-content { grid-template-columns: 1fr; }
            .stat-grid { grid-template-columns: 1fr 1fr; }
            .verify-card { flex-direction: column; align-items: flex-start; }
          }
        `}
            </style>

            <div className="mypage-content">
                <aside className="card">
                    <div className="profile-avatar">{myInfo?.nickname.charAt(0)}</div>
                    <div className="profile-name">{myInfo?.nickname ?? '-'}</div>
                    <div className="profile-team">{favoriteTeamName ? `${favoriteTeamName} 팬` : '응원팀 미설정'}</div>
                    <div className="profile-meta">
                        <div>
                            <div className="meta-label">이메일</div>
                            <div className="meta-value">{myInfo?.email ?? '-'}</div>
                        </div>
                        <div>
                            <div className="meta-label">가입일</div>
                            <div className="meta-value">{joinDate}</div>
                        </div>
                    </div>
                    <button className="btn-secondary" onClick={handleEditProfile}>프로필 수정</button>
                </aside>

                <div className="mypage-main">
                    <div className="stat-grid">
                        <div className="stat-card">
                            <div className="stat-label">직관 승률</div>
                            <div className="stat-value accent">{winRate}%</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">전적</div>
                            <div className="stat-value">{mockStats.wins}승 {mockStats.losses}패</div>
                            <div className="stat-sub">{mockStats.totalAttendances}경기 · {mockStats.draws}무</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">등급</div>
                            <div className="stat-value small">{badge.title}</div>
                            <div className="stat-sub">{badge.desc}</div>
                        </div>
                    </div>

                    <section className="card verify-card">
                        <div>
                            <div className="card-title">직관 인증</div>
                            <div className="card-desc">경기장 위치나 티켓 사진으로 인증해요</div>
                        </div>
                        <div className="verify-buttons">
                            <button className="btn-outline" onClick={handleGpsVerify}>위치 인증</button>
                            <button className="btn-outline" onClick={handleOcrClick}>티켓 인증</button>
                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-title">최근 직관 기록</div>
                        <div className="history-list">
                            {mockHistory.map((game) => (
                                <div key={game.id} className="history-row">
                                    <div>
                                        <div className="history-game">{game.opponent}</div>
                                        <div className="history-meta">
                                            {game.date} · {game.stadium} · {game.verifyMethod === 'GPS' ? '위치 인증' : '티켓 인증'}
                                        </div>
                                    </div>
                                    <span className={`history-result ${game.result === 'WIN' ? 'win' : 'lose'}`}>
                                        {game.result === 'WIN' ? '승' : '패'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
