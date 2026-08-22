export type TabType = 'home' | 'recommend' | 'analysis' | 'ranking' | 'community' | 'login' | 'signup';

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

export type PostCategory = 'PREVIEW' | 'CERTIFICATION' | 'ETC';

export interface CommunityPost {
    id: number;
    gameId: number;
    category: PostCategory;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    commentCount: number;
}

export interface PostComment {
    id: number;
    postId: number;
    author: string;
    content: string;
    createdAt: string;
}