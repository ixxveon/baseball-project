import React from 'react';

interface TeamRanking {
    rank: number;
    teamName: string;
    games: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: string;
    gameBehind: string;
    streak: string;
    isMyTeam?: boolean;
}

const mockRankings: TeamRanking[] = [
    { rank: 1, teamName: 'KIA 타이거즈', games: 110, wins: 65, draws: 2, losses: 43, winRate: '0.602', gameBehind: '0.0', streak: '3승' },
    { rank: 2, teamName: 'LG 트윈스', games: 112, wins: 60, draws: 2, losses: 50, winRate: '0.545', gameBehind: '5.5', streak: '1패', isMyTeam: true },
    { rank: 3, teamName: '삼성 라이온즈', games: 111, wins: 60, draws: 2, losses: 49, winRate: '0.550', gameBehind: '5.5', streak: '2승' },
    { rank: 4, teamName: '두산 베어스', games: 114, wins: 58, draws: 2, losses: 54, winRate: '0.518', gameBehind: '8.5', streak: '1패' },
    { rank: 5, teamName: 'SSG 랜더스', games: 111, wins: 56, draws: 1, losses: 54, winRate: '0.509', gameBehind: '9.5', streak: '2패' },
    { rank: 6, teamName: 'NC 다이노스', games: 110, wins: 49, draws: 2, losses: 59, winRate: '0.454', gameBehind: '15.5', streak: '5패' },
    { rank: 7, teamName: '한화 이글스', games: 109, wins: 48, draws: 2, losses: 59, winRate: '0.449', gameBehind: '16.0', streak: '1승' },
    { rank: 8, teamName: '롯데 자이언츠', games: 108, wins: 47, draws: 3, losses: 58, winRate: '0.448', gameBehind: '16.0', streak: '2승' },
    { rank: 9, teamName: 'KT 위즈', games: 111, wins: 53, draws: 2, losses: 56, winRate: '0.486', gameBehind: '12.0', streak: '1패' },
    { rank: 10, teamName: '키움 히어로즈', games: 110, wins: 42, draws: 0, losses: 68, winRate: '0.382', gameBehind: '23.0', streak: '3패' },
];

export default function RankingPage(): React.JSX.Element {

    // 1~5위 진출권 강조 색상 유지
    const getRankBadgeClass = (rank: number) => {
        if (rank === 1) return 'rank-badge rank-1';
        if (rank === 2) return 'rank-badge rank-2';
        if (rank === 3) return 'rank-badge rank-3';
        if (rank <= 5) return 'rank-badge rank-ps'; // 4, 5위 강조
        return 'rank-badge rank-other';             // 6위 이하
    };

    return (
        <div className="ranking-page-container">
            <style>
                {`
          .ranking-page-container {
            background-color: #F4F6F8;
            min-height: 100vh;
            padding: 40px 16px;
            font-family: 'Pretendard', 'Malgun Gothic', sans-serif;
          }
          .ranking-max-width { max-width: 1024px; margin: 0 auto; }
          .ranking-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
          .ranking-title { font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; }
          .ranking-subtitle { font-size: 14px; color: #6b7280; margin: 0; font-weight: 500; }
          
          .my-team-badge { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #374151; background: #ffffff; padding: 10px 20px; border-radius: 999px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
          .my-team-name { background: #fef2f2; color: #E6002D; padding: 4px 12px; border-radius: 999px; }
          
          .table-wrapper { background: #ffffff; border-radius: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #e5e7eb; overflow-x: auto; }
          .ranking-table { width: 100%; border-collapse: collapse; text-align: center; white-space: nowrap; }
          .ranking-table th { background: linear-gradient(to right, #111827, #1f2937); color: #d1d5db; padding: 20px 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; }
          .ranking-table th.left-align { text-align: left; }
          .ranking-table td { padding: 16px; font-size: 14px; color: #4b5563; border-bottom: 1px solid #f9fafb; transition: background-color 0.2s; }
          
          .ranking-table tr:hover td { background-color: #f9fafb; }
          .ranking-table tr.my-team-row td { background-color: #fef2f2; }
          .ranking-table tr.my-team-row:hover td { background-color: #fee2e2; }
          .ranking-table tr.my-team-row td:first-child { border-left: 4px solid #E6002D; }
          
          /* 순위 배지 디자인 */
          .rank-badge { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; margin: 0 auto; border-radius: 50%; font-weight: bold; font-size: 13px; }
          .rank-1 { background: linear-gradient(135deg, #fde047, #eab308); color: #fff; box-shadow: 0 4px 6px -1px rgba(234,179,8,0.3); }
          .rank-2 { background: linear-gradient(135deg, #d1d5db, #9ca3af); color: #fff; box-shadow: 0 4px 6px -1px rgba(156,163,175,0.3); }
          .rank-3 { background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; box-shadow: 0 4px 6px -1px rgba(249,115,22,0.3); }
          .rank-ps { background: #4b5563; color: #fff; } /* 4, 5위 강조 */
          .rank-other { background: #f3f4f6; color: #9ca3af; } /* 6위 이하 */
          
          .team-info { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #1f2937; text-align: left; font-size: 15px; }
          .team-logo { width: 36px; height: 36px; border-radius: 50%; background: #f9fafb; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af; }
          .win-rate { font-weight: 800; color: #E6002D; font-size: 15px; }
          
          .streak-badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
          .streak-win { background: #fef2f2; color: #E6002D; border: 1px solid #fee2e2; }
          .streak-lose { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
        `}
            </style>

            <div className="ranking-max-width">
                <div className="ranking-header">
                    <div>
                        <h1 className="ranking-title">
                            KBO 정규리그 순위 <span style={{ fontSize: '24px' }}>🔥</span>
                        </h1>
                        <p className="ranking-subtitle">2026.08.17 기준 <span style={{ margin: '0 8px' }}>|</span> 매일 자정 업데이트</p>
                    </div>
                    <div className="my-team-badge">
                        <span style={{ color: '#E6002D', fontSize: '18px' }}>★</span> 내 응원팀
                        <span className="my-team-name">LG 트윈스</span>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="ranking-table">
                        <thead>
                        <tr>
                            <th>순위</th>
                            <th className="left-align">팀명</th>
                            <th>경기</th>
                            <th>승</th>
                            <th>무</th>
                            <th>패</th>
                            <th style={{ color: '#f87171' }}>승률</th>
                            <th>게임차</th>
                            <th>최근 흐름</th>
                        </tr>
                        </thead>

                        <tbody>
                        {mockRankings.map((team) => (
                            <tr key={team.teamName} className={team.isMyTeam ? 'my-team-row' : ''}>
                                <td>
                                    <div className={getRankBadgeClass(team.rank)}>{team.rank}</div>
                                </td>
                                <td>
                                    <div className="team-info">
                                        <div className="team-logo">로고</div>
                                        {team.teamName}
                                    </div>
                                </td>
                                <td>{team.games}</td>
                                <td style={{ fontWeight: 600, color: '#1f2937' }}>{team.wins}</td>
                                <td>{team.draws}</td>
                                <td>{team.losses}</td>
                                <td className="win-rate">{team.winRate}</td>
                                <td style={{ fontWeight: 500 }}>{team.gameBehind}</td>
                                <td>
                    <span className={`streak-badge ${team.streak.includes('승') ? 'streak-win' : 'streak-lose'}`}>
                      {team.streak}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}