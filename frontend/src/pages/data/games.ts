import { GamePick } from '../types';

export const gamesData: GamePick[] = [
    { id: 1, date: "08.18 (화) 18:30", team1: "LG", team2: "KT", stadium: "잠실야구장", winRate: "75%", score: "82점", tag: "추천", stars: "★★★★☆", selected: false, grade: "A" },
    { id: 2, date: "08.21 (금) 18:30", team1: "삼성", team2: "LG", stadium: "잠실야구장", winRate: "88%", score: "92점", tag: "강력 추천", stars: "★★★★★", selected: true, grade: "S" },
    { id: 3, date: "08.25 (화) 18:30", team1: "SSG", team2: "LG", stadium: "잠실야구장", winRate: "60%", score: "75점", tag: "보통", stars: "★★★☆☆", selected: false, grade: "B" },
    { id: 4, date: "08.28 (금) 18:30", team1: "NC", team2: "LG", stadium: "잠실야구장", winRate: "45%", score: "65점", tag: "낮음", stars: "★★☆☆☆", selected: false, grade: "C" },
];