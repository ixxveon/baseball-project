import React from 'react';

export default function NoticeBoard(): React.JSX.Element {
    return (
        <div className="notice-box">
            <div className="notice-header">
                <h3>공지사항</h3>
                <button type="button" className="text-btn">더보기 &rsaquo;</button>
            </div>
            <div className="notice">
                <span>[안내] 2026년 하반기 경기 일정 안내</span>
                <small>08.10</small>
            </div>
            <div className="notice">
                <span>[안내] 티켓 예매처 점검 시간 안내</span>
                <small>08.08</small>
            </div>
            <div className="notice">
                <span>[업데이트] AI 분석 모델 업데이트 완료</span>
                <small>08.05</small>
            </div>
        </div>
    );
}