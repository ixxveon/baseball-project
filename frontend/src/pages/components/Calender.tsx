import React from 'react';

export default function Calender(): React.JSX.Element {
    return (
        <section className="calendar-box">
            <div className="calendar-header-row">
                <h2>2026년 8월 직관 캘린더</h2>
                <div className="calendar-view-toggle">
                    <button type="button" className="toggle-btn active">월간 보기</button>
                    <button type="button" className="toggle-btn">목록 보기</button>
                </div>
            </div>

            <div className="calendar-grid">
                <div className="calendar-weekday sun">일</div>
                <div className="calendar-weekday">월</div>
                <div className="calendar-weekday">화</div>
                <div className="calendar-weekday">수</div>
                <div className="calendar-weekday">목</div>
                <div className="calendar-weekday">금</div>
                <div className="calendar-weekday sat">토</div>

                <div className="calendar-day other-month"><span className="day-number">26</span></div>
                <div className="calendar-day other-month"><span className="day-number">27</span></div>
                <div className="calendar-day other-month"><span className="day-number">28</span></div>
                <div className="calendar-day other-month"><span className="day-number">29</span></div>
                <div className="calendar-day other-month"><span className="day-number">30</span></div>
                <div className="calendar-day other-month"><span className="day-number">31</span></div>
                <div className="calendar-day"><span className="day-number">1</span></div>

                <div className="calendar-day"><span className="day-number">2</span></div>
                <div className="calendar-day"><span className="day-number">3</span></div>
                <div className="calendar-day">
                    <span className="day-number">4</span>
                    <span className="day-event badge-gray">vs KIA</span>
                </div>
                <div className="calendar-day"><span className="day-number">5</span></div>
                <div className="calendar-day"><span className="day-number">6</span></div>
                <div className="calendar-day"><span className="day-number">7</span></div>
                <div className="calendar-day">
                    <span className="day-number">8</span>
                    <span className="day-event badge-gray">vs 키움</span>
                </div>

                <div className="calendar-day"><span className="day-number">9</span></div>
                <div className="calendar-day"><span className="day-number">10</span></div>
                <div className="calendar-day"><span className="day-number">11</span></div>
                <div className="calendar-day"><span className="day-number">12</span></div>
                <div className="calendar-day"><span className="day-number">13</span></div>
                <div className="calendar-day"><span className="day-number">14</span></div>
                <div className="calendar-day"><span className="day-number">15</span></div>

                <div className="calendar-day"><span className="day-number">16</span></div>
                <div className="calendar-day today highlight-s">
                    <span className="day-number">17</span>
                    <span className="day-event">vs 두산<br/><small>A 87</small></span>
                </div>
                <div className="calendar-day highlight-a">
                    <span className="day-number">18</span>
                    <span className="day-event">vs KT<br/><small>A 82</small></span>
                </div>
                <div className="calendar-day"><span className="day-number">19</span></div>
                <div className="calendar-day"><span className="day-number">20</span></div>
                <div className="calendar-day highlight-s">
                    <span className="day-number">21</span>
                    <span className="day-event">vs 삼성<br/><small>S 92</small></span>
                </div>
                <div className="calendar-day"><span className="day-number">22</span></div>

                <div className="calendar-day"><span className="day-number">23</span></div>
                <div className="calendar-day"><span className="day-number">24</span></div>
                <div className="calendar-day highlight-b">
                    <span className="day-number">25</span>
                    <span className="day-event">vs SSG<br/><small>B 75</small></span>
                </div>
                <div className="calendar-day"><span className="day-number">26</span></div>
                <div className="calendar-day"><span className="day-number">27</span></div>
                <div className="calendar-day highlight-c">
                    <span className="day-number">28</span>
                    <span className="day-event">vs NC<br/><small>C 65</small></span>
                </div>
                <div className="calendar-day"><span className="day-number">29</span></div>

                <div className="calendar-day"><span className="day-number">30</span></div>
                <div className="calendar-day"><span className="day-number">31</span></div>
                <div className="calendar-day other-month"><span className="day-number">1</span></div>
                <div className="calendar-day other-month"><span className="day-number">2</span></div>
                <div className="calendar-day other-month"><span className="day-number">3</span></div>
                <div className="calendar-day other-month"><span className="day-number">4</span></div>
                <div className="calendar-day other-month"><span className="day-number">5</span></div>
            </div>

            <div className="calendar-legend">
                <span><i className="dot s"></i> 강력 추천</span>
                <span><i className="dot a"></i> 추천</span>
                <span><i className="dot b"></i> 보통</span>
                <span><i className="dot c"></i> 낮음</span>
                <span><i className="dot none"></i> 경기 없음</span>
            </div>
        </section>
    );
}