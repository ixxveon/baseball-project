import React, { useState, useEffect } from 'react';

export default function NoticeBoard(): React.JSX.Element {
    const notices = [
        '[안내] 2026년 하반기 경기 일정 및 AI 분석 모델 업데이트 안내',
        '[안내] 티켓 예매처 점검 시간 및 알림 서비스 설정 방법',
        '[업데이트] 실시간 직관 승률 예측 알고리즘 성능 개선 완료'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
        }, 3000); // 3초마다 변경

        return () => clearInterval(timer);
    }, [notices.length]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minWidth: 0,
            fontSize: '13px',
            color: '#334155'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: 0,
                flex: 1
            }}>
                <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    flexShrink: 0
                }}>
                    공지
                </span>

                <span style={{
                    fontWeight: '500',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    transition: 'all 0.3s ease-in-out'
                }}>
                    {notices[currentIndex]}
                </span>
            </div>

            <span style={{
                fontSize: '12px',
                color: '#94a3b8',
                flexShrink: 0,
                marginLeft: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
            }}>
                더보기 &rsaquo;
            </span>
        </div>
    );
}