import type { GameRecommendation } from '../types';

export const gamesData: GameRecommendation[] = [
    {
        gameId: 101,
        gameDate: "2026-08-27T18:30:00",
        stadium: "잠실야구장",
        homeTeam: "LG 트윈스",
        awayTeam: "두산 베어스",
        winProbability: 0.68,
        recommendationScore: "87점",
        recommendationGrade: "A",
        tag: "추천",
        summaryComment: "선발 투수 우세 분석 및 최근 타격 사이클 우수"
    },
    {
        gameId: 102,
        gameDate: "2026-08-27T18:30:00",
        stadium: "고척스카이돔",
        homeTeam: "키움 히어로즈",
        awayTeam: "SSG 랜더스",
        winProbability: 0.45,
        recommendationScore: "65점",
        recommendationGrade: "C",
        tag: "보통",
        summaryComment: "팽팽한 불펜 싸움 예상, 원정팀 미세 우세"
    },
    {
        gameId: 103,
        gameDate: "2026-08-28T18:30:00",
        stadium: "수원KT위즈파크",
        homeTeam: "KT 위즈",
        awayTeam: "삼성 라이온즈",
        winProbability: 0.75,
        recommendationScore: "92점",
        recommendationGrade: "S",
        tag: "강력 추천",
        summaryComment: "홈 승률 최상위 팀과 상대 전적 우세 겹침"
    },
    {
        gameId: 104,
        gameDate: "2026-08-28T18:30:00",
        stadium: "창원NC파크",
        homeTeam: "NC 다이노스",
        awayTeam: "KIA 타이거즈",
        winProbability: 0.52,
        recommendationScore: "74점",
        recommendationGrade: "B",
        tag: "추천",
        summaryComment: "핵심 타자 부상 복귀 변수 및 구장 홈 이점 분석"
    },
    {
        gameId: 105,
        gameDate: "2026-08-29T17:00:00",
        stadium: "사직야구장",
        homeTeam: "롯데 자이언츠",
        awayTeam: "한화 이글스",
        winProbability: 0.58,
        recommendationScore: "80점",
        recommendationGrade: "A",
        tag: "추천",
        summaryComment: "주말 시리즈 첫 경기 집중력 및 날씨 환경 영향 분석"
    }
];