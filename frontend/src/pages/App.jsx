import React, { useState } from 'react';
import './App.css';
import Header from "./components/Header";
import RecommendedGames from "./components/RecommendedGames";
import PickGames from "./components/PickGames";
import Calender from "./components/Calender";

export default function App() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="dashboard-container">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="dashboard-main">
                {activeTab === 'home' ? (
                    <>
                        {/* 상단 웰컴 바 & 응원팀 선택 */}
                        <div className="welcome-section">
                            <div className="welcome-text">
                                <h1>안녕하세요, 민형님! 👋</h1>
                                <p>LG 트윈스의 승리를 위닝PICK이 함께 예측합니다!</p>
                            </div>
                            <div className="my-team-selector">
                                <span className="star-icon">★</span>
                                <span className="label">내 응원팀</span>
                                <select defaultValue="LG">
                                    <option value="LG">LG 트윈스</option>
                                    <option value="두산">두산 베어스</option>
                                    <option value="삼성">삼성 라이온즈</option>
                                </select>
                            </div>
                        </div>

                        {/* 1. 오늘의 추천 경기 + AI 분석 요약 (상단 2열) */}
                        <div style={{ marginBottom: "24px" }}>
                            <RecommendedGames />
                        </div>

                        {/* 2. 이번 달 직관 추천 경기 (가로 100%) */}
                        <div style={{ marginBottom: "24px" }}>
                            <PickGames />
                        </div>

                        {/* 3. 하단 2열: (캘린더 + 성적 요약) / (사이드바) */}
                        <div className="dashboard-grid">
                            {/* 좌측 메인 영역 */}
                            <div className="main-content-column">
                                <Calender />

                                {/* 최근 성적 요약 */}
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
                            </div>

                            {/* 우측 사이드바 영역 */}
                            <div className="sidebar-column">
                                {/* 티켓 오픈 알림 설정 */}
                                <div className="alarm-box">
                                    <div className="alarm-header">
                                        <h3>티켓 오픈 알림 설정</h3>
                                        <button className="text-btn">설정하기 &rsaquo;</button>
                                    </div>
                                    <p>티켓 오픈 1시간 전 / 10분 전 알림을 받아보세요!</p>
                                    <div className="bell-icon-large">🔔</div>
                                </div>

                                {/* 예매 바로가기 */}
                                <div className="reservation-box">
                                    <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "16px" }}>
                                        예매 바로가기
                                    </h3>
                                    <div className="reservation-list">
                                        <div className="reservation">
                                            <b className="ticketlink">TL</b>
                                            <span>티켓링크 ↗</span>
                                        </div>
                                        <div className="reservation">
                                            <b className="interpark">INT</b>
                                            <span>인터파크 티켓 ↗</span>
                                        </div>
                                        <div className="reservation">
                                            <b className="twins">TWINS</b>
                                            <span>LG 트윈스 예매 ↗</span>
                                        </div>
                                        <div className="reservation">
                                            <b className="melon">melon</b>
                                            <span>멜론티켓 ↗</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 공지사항 */}
                                <div className="notice-box">
                                    <div className="notice-header">
                                        <h3>공지사항</h3>
                                        <button className="text-btn">더보기 &rsaquo;</button>
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
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="tab-placeholder">
                        <h2>{activeTab} 페이지 준비 중입니다.</h2>
                    </div>
                )}
            </main>
        </div>
    );
}