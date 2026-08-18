export default function RecentSummary() {
    return (
        <section className="box recent-box">
            <h2>최근 성적 요약</h2>

            <div className="recent-content">
                <div className="recent-stat">
                    <span>최근 10경기</span>
                    <strong>7승 3패</strong>
                    <small>승률 70%</small>
                </div>

                <div className="donut">
                    <span>70%</span>
                </div>

                <div className="recent-stat">
                    <span>팀 평균 득점</span>
                    <strong>5.2점</strong>
                    <div className="mini-chart red"></div>
                </div>

                <div className="recent-stat">
                    <span>팀 평균 실점</span>
                    <strong>3.8점</strong>
                    <div className="mini-chart blue"></div>
                </div>
            </div>
        </section>
    );
}