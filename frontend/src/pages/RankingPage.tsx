import React, { useEffect, useState } from 'react';
import { ResponseRanking } from '../types/ranking';
import axiosInstance from '../api/axiosInstance'; // 👈 axiosInstance 임포트 (경로 확인 필요)

export default function RankingPage(): React.JSX.Element {
    const [rankings, setRankings] = useState<ResponseRanking[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null); //에러 상태

    useEffect(() => {
        // 👈 기존 fetch 대신 axiosInstance 사용
        // baseURL이 '/api/v1'로 설정되어 있으므로 '/rankings'만 적으면 됩니다.
        axiosInstance.get('/rankings')
            .then((res) => {
                // Axios 기본 응답인 res.data 안에 백엔드가 포장한 ApiResponse 객체가 들어있고,
                // 그 안의 실제 데이터(data 필드)를 꺼내서 세팅합니다.
                // (팀의 ApiResponse 구조에 따라 res.data.data가 아닌 res.data.result 등일 수 있으니 확인해 주세요!)
                setRankings(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('랭킹 데이터 로딩 실패:', err);
                setError('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. 😢');
                setLoading(false);
            });
    }, []);

    // 1~5위 진출권 강조 색상 함수
    const getRankBadgeClass = (rank: number) => {
        if (rank === 1) return 'rank-badge rank-1';
        if (rank === 2) return 'rank-badge rank-2';
        if (rank === 3) return 'rank-badge rank-3';
        if (rank <= 5) return 'rank-badge rank-ps'; // 4, 5위 강조
        return 'rank-badge rank-other'; // 6위 이하
    };

    return (
        <div className="ranking-page-container">
            {/* CSS 스타일 태그 부분은 기존과 완벽히 동일하므로 생략 없이 그대로 유지하시면 됩니다. */}
            <style>
                {`
          .ranking-page-container { background-color: #F4F6F8; min-height: 100vh; padding: 40px 16px; font-family: 'Pretendard', 'Malgun Gothic', sans-serif; }
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
          .rank-badge { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; margin: 0 auto; border-radius: 50%; font-weight: bold; font-size: 13px; }
          .rank-1 { background: linear-gradient(135deg, #fde047, #eab308); color: #fff; box-shadow: 0 4px 6px -1px rgba(234,179,8,0.3); }
          .rank-2 { background: linear-gradient(135deg, #d1d5db, #9ca3af); color: #fff; box-shadow: 0 4px 6px -1px rgba(156,163,175,0.3); }
          .rank-3 { background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; box-shadow: 0 4px 6px -1px rgba(249,115,22,0.3); }
          .rank-ps { background: #4b5563; color: #fff; }
          .rank-other { background: #f3f4f6; color: #9ca3af; }
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
                        <p className="ranking-subtitle">
                            2026.08.17 기준 <span style={{ margin: '0 8px' }}>|</span> 백엔드 실시간 연동 완료
                        </p>
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
                        {loading ? (
                            <tr>
                                <td colSpan={9} style={{ padding: '40px', color: '#6b7280' }}>
                                    데이터를 불러오는 중입니다... ⚾
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={9} style={{ padding: '40px', color: '#ef4444', fontWeight: 'bold' }}>
                                    {error}
                                </td>
                            </tr>
                        ) : rankings.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ padding: '40px', color: '#6b7280' }}>
                                    현재 등록된 랭킹 데이터가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            rankings.map((team) => {
                                const isMyTeam = team.teamName === 'LG 트윈스';

                                return (
                                    <tr key={team.teamName} className={isMyTeam ? 'my-team-row' : ''}>
                                        <td>
                                            <div className={getRankBadgeClass(team.teamRank)}>{team.teamRank}</div>
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
                                        {/* 👈 winRate와 gameDiff를 소수점 자리수에 맞게 포맷팅합니다 */}
                                        <td className="win-rate">{Number(team.winRate).toFixed(3)}</td>
                                        <td style={{ fontWeight: 500 }}>{Number(team.gameDiff).toFixed(1)}</td>
                                        <td>
                                                <span className={`streak-badge ${team.streak.includes('승') ? 'streak-win' : 'streak-lose'}`}>
                                                    {team.streak}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}