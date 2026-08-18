import React from 'react';

export default function RecentSummary(): React.JSX.Element {
    return (
        <div className="recent-box">
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "16px" }}>
                최근 성적 요약
            </h3>
            <div className="summary-wrapper">
                <div className="donut-stat">
                    <div className="donut-circle">
                        <span className="sub">최근 10경기</span>
                        <strong className="main">7승 3패</strong>
                        <span className="rate">승률 70%</span>
                    </div>
                </div>
                <div className="spark-stat">
                    <span className="title">팀 평균 득점</span>
                    <strong className="score">5.2점</strong>
                    <span className="line-chart red">📈</span>
                </div>
                <div className="spark-stat">
                    <span className="title">팀 평균 실점</span>
                    <strong className="score">3.8점</strong>
                    <span className="line-chart blue">📉</span>
                </div>
            </div>
        </div>
    );
}