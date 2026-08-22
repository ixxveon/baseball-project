export type TabType = 'home' | 'recommend' | 'analysis' | 'ranking' | 'community';

export interface GamePick {
    id: number;
    date: string;
    team1: string;
    team2: string;
    stadium: string;
    winRate: string;
    score: string;
    tag: string;
    stars: string;
    selected: boolean;
    grade: 'S' | 'A' | 'B' | 'C';
}

export interface HeaderProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export interface GameCardProps {
    game: GamePick;
}