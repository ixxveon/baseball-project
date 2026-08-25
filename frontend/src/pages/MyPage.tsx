import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- [타입 정의] ---
interface UserStats {
    totalAttendances: number;
    wins: number;
    draws: number;
    losses: number;
}

interface GameRecord {
    id: number;
    date: string;
    opponent: string;
    stadium: string;
    result: 'WIN' | 'LOSE' | 'DRAW' | 'CANCELED';
    verifyMethod: 'GPS' | 'TICKET' | 'UNVERIFIED';
}

interface UserProfile {
    nickname: string;
    email: string;
    favoriteTeam: string;
    joinDate: string;
}

// --- [목업 데이터] ---
const mockProfile: UserProfile = {
    nickname: '위닝요정',
    email: 'winning@example.com',
    favoriteTeam: 'LG 트윈스', // 기존 랭킹 페이지와 동일한 응원팀 적용
    joinDate: '2026.01.15',
};

const mockStats: UserStats = { totalAttendances: 8, wins: 6, draws: 0, losses: 2 };
const mockHistory: GameRecord[] = [
    { id: 1, date: '2026.08.15', opponent: 'vs 두산 베어스', stadium: '잠실야구장', result: 'WIN', verifyMethod: 'GPS' },
    { id: 2, date: '2026.08.10', opponent: 'vs SSG 랜더스', stadium: '문학야구장', result: 'LOSE', verifyMethod: 'TICKET' },
    { id: 3, date: '2026.08.05', opponent: 'vs KIA 타이거즈', stadium: '잠실야구장', result: 'WIN', verifyMethod: 'GPS' },
];

export default function MyPage(): React.JSX.Element {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate(); // 📌 1. 페이지 이동을 위한 navigate 선언!

    const calculateWinRate = (wins: number, losses: number) => {
        const totalDecisions = wins + losses;
        if (totalDecisions === 0) return 0;
        return Math.round((wins / totalDecisions) * 100);
    };

    const winRate = calculateWinRate(mockStats.wins, mockStats.losses);

    const getBadgeInfo = (total: number, rate: number) => {
        if (total < 5) return { title: '직관 새싹 🌱', class: 'badge-seed', desc: '5경기 인증 시 배지가 부여됩니다.' };
        if (rate === 100) return { title: '무패 요정 (다이아) 💎', class: 'badge-diamond', desc: '직관 승률 100%! 완벽한 승리 요정입니다.' };
        if (rate >= 90) return { title: '초일류 승요 (골드) 🥇', class: 'badge-gold', desc: '직관 승률 90% 이상! 팀의 승리를 이끄는 자.' };
        if (rate >= 80) return { title: '엘리트 승요 (실버) 🥈', class: 'badge-silver', desc: '직관 승률 80% 이상! 훌륭한 승요입니다.' };
        if (rate >= 70) return { title: '승리 요정 (브론즈) 🥉', class: 'badge-bronze', desc: '직관 승률 70% 이상! 승리의 기운이 함께합니다.' };
        if (rate < 30) return { title: '패배 요정 🌧️', class: 'badge-lose', desc: '직관 승률 30% 미만... 힐링이 필요해요.' };
        return { title: '열혈 직관러 🔥', class: 'badge-normal', desc: '열정적으로 팀을 응원하고 있습니다!' };
    };

    const badge = getBadgeInfo(mockStats.totalAttendances, winRate);

    // 이벤트 핸들러
    const handleGpsVerify = () => alert("GPS 위치 확인 중입니다...");
    const handleOcrClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) alert(`${file.name} 이미지를 분석 중입니다...`);
    };

    // 📌 2. 프로필 수정 페이지로 넘어가도록 수정!
    const handleEditProfile = () => {
        navigate('/profile-edit');
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까? 직관 기록과 승률 배지가 모두 삭제됩니다.");
        if (confirmDelete) {
            alert("회원 탈퇴 요청이 접수되었습니다. (API 연동 필요)");
            // TODO: DELETE /api/v1/members/me 호출 및 로그아웃 처리
        }
    };

    return (
        <div className="mypage-container">
            <style>
                {`
          .mypage-container { background-color: #F4F6F8; min-height: 100vh; padding: 40px 16px 80px; font-family: 'Pretendard', sans-serif; }
          .mypage-content { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
          .card-section { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; }
          .section-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
          
          /* 대시보드 영역 */
          .dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
          @media (max-width: 600px) { .dashboard-grid { grid-template-columns: 1fr; } }
          
          .win-rate-box { background: #111827; border-radius: 16px; padding: 24px; text-align: center; color: #fff; }
          .win-rate-title { font-size: 14px; color: #9ca3af; margin-bottom: 8px; }
          .win-rate-value { font-size: 48px; font-weight: 900; color: #E6002D; line-height: 1; margin-bottom: 16px; }
          .stats-row { display: flex; justify-content: space-around; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; }
          
          .badge-box { border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
          .badge-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
          .badge-desc { font-size: 14px; font-weight: 500; opacity: 0.9; }
          
          .badge-seed { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
          .badge-diamond { background: linear-gradient(135deg, #e0f2fe, #7dd3fc); color: #0284c7; box-shadow: 0 4px 12px rgba(125,211,252,0.4); }
          .badge-gold { background: linear-gradient(135deg, #fef08a, #eab308); color: #854d0e; box-shadow: 0 4px 12px rgba(234,179,8,0.4); }
          .badge-silver { background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #374151; box-shadow: 0 4px 12px rgba(156,163,175,0.4); }
          .badge-bronze { background: linear-gradient(135deg, #fed7aa, #f97316); color: #9a3412; box-shadow: 0 4px 12px rgba(249,115,22,0.4); }
          .badge-lose { background: linear-gradient(135deg, #1e3a8a, #312e81); color: #e0e7ff; box-shadow: 0 4px 12px rgba(30,58,138,0.4); }
          .badge-normal { background: #f3f4f6; color: #4b5563; }

          /* 내 정보 영역 추가 */
          .profile-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .info-item { background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; }
          .info-label { font-size: 13px; color: #6b7280; margin-bottom: 4px; font-weight: 500; }
          .info-value { font-size: 16px; color: #111827; font-weight: 700; }
          .btn-edit-profile { width: 100%; padding: 14px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 12px; font-size: 15px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.2s; }
          .btn-edit-profile:hover { background: #f3f4f6; }

          /* 인증 버튼 영역 */
          .verify-buttons { display: flex; gap: 16px; }
          .verify-btn { flex: 1; padding: 20px; border-radius: 16px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: transform 0.1s, box-shadow 0.2s; }
          .btn-gps { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
          .btn-ocr { background: #fdf2f8; color: #db2777; border: 1px solid #fbcfe8; }
          .btn-icon { font-size: 24px; }
          
          /* 기록 영역 */
          .history-list { display: flex; flex-direction: column; gap: 12px; }
          .history-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6; }
          .history-info-date { font-size: 12px; color: #6b7280; font-weight: 500; margin-bottom: 4px; }
          .history-info-game { font-size: 15px; font-weight: 700; color: #111827; }
          .history-result-wrap { display: flex; align-items: center; gap: 12px; }
          .verify-tag { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
          .tag-gps { background: #dbeafe; color: #1d4ed8; }
          .tag-ocr { background: #fce7f3; color: #be185d; }
          .result-tag { font-size: 14px; font-weight: 800; padding: 6px 12px; border-radius: 8px; }
          .res-win { background: #fef2f2; color: #E6002D; }
          .res-lose { background: #f3f4f6; color: #6b7280; }

          /* 회원 탈퇴 영역 */
          .danger-zone { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
          .danger-text { font-size: 13px; color: #6b7280; }
          .btn-delete-account { background: transparent; border: none; color: #ef4444; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: underline; text-underline-offset: 4px; }
          .btn-delete-account:hover { color: #b91c1c; }
        `}
            </style>

            <div className="mypage-content">
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>마이 직관 대시보드 🏟️</h1>

                {/* 2. 내 정보 영역 (추가됨) */}
                <section className="card-section">
                    <h2 className="section-title">👤 내 정보</h2>
                    <div className="profile-info-grid">
                        <div className="info-item">
                            <div className="info-label">닉네임</div>
                            <div className="info-value">{mockProfile.nickname}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">응원팀</div>
                            <div className="info-value" style={{ color: '#E6002D' }}>{mockProfile.favoriteTeam}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">계정 이메일</div>
                            <div className="info-value">{mockProfile.email}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">가입일</div>
                            <div className="info-value">{mockProfile.joinDate}</div>
                        </div>
                    </div>
                    {/* 버튼 클릭 시 이동! */}
                    <button className="btn-edit-profile" onClick={handleEditProfile}>프로필 수정하기</button>
                </section>

                {/* 1. 승률 및 배지 대시보드 */}
                <section className="card-section dashboard-grid">
                    <div className="win-rate-box">
                        <div className="win-rate-title">나의 직관 승률</div>
                        <div className="win-rate-value">{winRate}%</div>
                        <div className="stats-row">
                            <span>{mockStats.totalAttendances}전</span>
                            <span style={{ color: '#f87171' }}>{mockStats.wins}승</span>
                            <span>{mockStats.draws}무</span>
                            <span style={{ color: '#9ca3af' }}>{mockStats.losses}패</span>
                        </div>
                    </div>
                    <div className={`badge-box ${badge.class}`}>
                        <div className="badge-title">{badge.title}</div>
                        <div className="badge-desc">{badge.desc}</div>
                    </div>
                </section>


                {/* 3. 직관 인증하기 */}
                <section className="card-section">
                    <h2 className="section-title">📍 직관 인증하기</h2>
                    <div className="verify-buttons">
                        <button className="verify-btn btn-gps" onClick={handleGpsVerify}>
                            <span className="btn-icon">🗺️</span> GPS 위치 인증
                        </button>
                        <button className="verify-btn btn-ocr" onClick={handleOcrClick}>
                            <span className="btn-icon">🎫</span> 티켓 캡처 인증 (OCR)
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    </div>
                </section>

                {/* 4. 최근 직관 기록 */}
                <section className="card-section">
                    <h2 className="section-title">⚾ 최근 직관 기록</h2>
                    <div className="history-list">
                        {mockHistory.map((game) => (
                            <div key={game.id} className="history-item">
                                <div>
                                    <div className="history-info-date">{game.date} • {game.stadium}</div>
                                    <div className="history-info-game">{game.opponent}</div>
                                </div>
                                <div className="history-result-wrap">
                  <span className={`verify-tag ${game.verifyMethod === 'GPS' ? 'tag-gps' : 'tag-ocr'}`}>
                    {game.verifyMethod === 'GPS' ? 'GPS 인증' : '티켓 인증'}
                  </span>
                                    <span className={`result-tag ${game.result === 'WIN' ? 'res-win' : 'res-lose'}`}>
                    {game.result === 'WIN' ? '승리' : '패배'}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 📌 5. 회원 탈퇴 영역 (카드 섹션 밖으로 완전히 분리됨) */}
                <div className="danger-zone">
                    <span className="danger-text">더 이상 위닝PICK을 이용하지 않으시겠어요?</span>
                    <button className="btn-delete-account" onClick={handleDeleteAccount}>회원 탈퇴</button>
                </div>
            </div>
        </div>
    );
}