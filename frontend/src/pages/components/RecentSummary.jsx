export default function RecentSummary() {
    return (
        <div className="white-box recent-summary">
            <h2>최근 성적 요약</h2>

            <div className="recent-content">
                <div className="record">
                    <span>최근 10경기</span>
                    <strong>7승 3패</strong>
                    <small>승률 70%</small>
                </div>

                <div className="donut">
                    <div />
                </div>

                <div className="metric">
                    <span>팀 평균 득점</span>
                    <strong>5.2점</strong>
                    <div className="fake-chart red-chart" />
                </div>

                <div className="metric">
                    <span>팀 평균 실점</span>
                    <strong>3.8점</strong>
                    <div className="fake-chart blue-chart" />
                </div>
            </div>
        </div>
    );
}