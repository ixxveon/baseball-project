// frontend/src/data/mockMyPage.ts

// --- [타입 정의] ---
export interface UserStats {
    totalAttendances: number;
    wins: number;
    draws: number;
    losses: number;
}

export interface GameRecord {
    id: number;
    date: string;
    opponent: string;
    stadium: string;
    result: 'WIN' | 'LOSE' | 'DRAW' | 'CANCELED';
    verifyMethod: 'GPS' | 'TICKET' | 'UNVERIFIED';
}

export interface UserProfile {
    nickname: string;
    email: string;
    favoriteTeam: string;
    joinDate: string;
}

// --- [목업 데이터] ---
export const mockProfile: UserProfile = {
    nickname: '위닝요정',
    email: 'winning@example.com',
    favoriteTeam: 'LG 트윈스',
    joinDate: '2026.01.15',
};

export const mockStats: UserStats = { totalAttendances: 8, wins: 6, draws: 0, losses: 2 };

export const mockHistory: GameRecord[] = [
    { id: 1, date: '2026.08.15', opponent: 'vs 두산 베어스', stadium: '잠실야구장', result: 'WIN', verifyMethod: 'GPS' },
    { id: 2, date: '2026.08.10', opponent: 'vs SSG 랜더스', stadium: '문학야구장', result: 'LOSE', verifyMethod: 'TICKET' },
    { id: 3, date: '2026.08.05', opponent: 'vs KIA 타이거즈', stadium: '잠실야구장', result: 'WIN', verifyMethod: 'GPS' },
];