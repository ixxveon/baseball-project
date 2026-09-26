import React, { useEffect, useState } from 'react';
import { fetchRecentRecord, RecentRecord } from '../api/gamesApi';

interface RecentSummaryProps {
    teamId: number | null;
}

export default function RecentSummary({ teamId }: RecentSummaryProps): React.JSX.Element {
    const [record, setRecord] = useState<RecentRecord | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (teamId === null) return;

        let cancelled = false;
        setLoading(true);
        setError(null);
        fetchRecentRecord(teamId)
            .then((result) => {
                if (cancelled) return;
                setRecord(result);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setError('최근 성적을 불러오는 데 실패했습니다.');
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [teamId]);

    return (
        <div className="recent-box">
            <h3 className="recent-box-title">최근 성적 요약</h3>

            {teamId === null && (
                <p className="recent-box-status">응원팀 정보를 확인하는 중...</p>
            )}

            {teamId !== null && loading && (
                <p className="recent-box-status">불러오는 중...</p>
            )}

            {error && (
                <p className="recent-box-error">{error}</p>
            )}

            {!loading && !error && record && (
                <div className="summary-wrapper">
                    <div className="donut-stat">
                        <div className={`donut-circle ${record.winRate >= 50 ? 'win' : 'lose'}`}>
                            <strong className="rate">{record.winRate}%</strong>
                            <span className="sub">승률</span>
                        </div>
                        <span className="record-text">
                            {record.wins}승 {record.losses}패 · 최근 {record.gamesCount}경기
                        </span>
                    </div>

                    <div className="summary-divider" />

                    <div className="spark-stat">
                        <span className="title">평균 득점</span>
                        <strong className="score scored">{record.avgScored}</strong>
                    </div>

                    <div className="summary-divider" />

                    <div className="spark-stat">
                        <span className="title">평균 실점</span>
                        <strong className="score allowed">{record.avgAllowed}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}