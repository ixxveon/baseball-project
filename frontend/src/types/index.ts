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

export type PostCategory = 'PREVIEW' | 'CERTIFICATION' | 'ETC';

export interface CommunityPost {
    id: number;
    gameId: number;
    category: PostCategory;
    title: string;
    content: string;
    author: string;
    authorId: number;
    createdAt: string;
    commentCount: number;
}

export interface PostComment {
    id: number;
    postId: number;
    author: string;
    authorId: number;
    content: string;
    createdAt: string;
}