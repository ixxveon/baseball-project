import type { CommunityPost } from '../types';

export const communityPostsData: CommunityPost[] = [
    {
        id: 1,
        gameId: 2,
        category: 'PREVIEW',
        title: '오늘 LG vs 두산 선발 라인업 나왔네요',
        content: '오늘 선발투수 컨디션 괜찮아 보이는데 다들 어떻게 보시나요?',
        author: '트윈스팬',
        createdAt: '10분 전',
        commentCount: 12,
    },
    {
        id: 2,
        gameId: 2,
        category: 'CERTIFICATION',
        title: '오늘 직관 인증합니다 ㅎㅎ',
        content: '3루측 응원석에서 봤는데 분위기 미쳤어요',
        author: '잠실직관러',
        createdAt: '25분 전',
        commentCount: 8,
    },
    {
        id: 3,
        gameId: 1,
        category: 'ETC',
        title: '주차장 정보 공유합니다',
        content: '잠실 근처 저렴한 주차장 아시는 분 있나요',
        author: '초보직관러',
        createdAt: '1시간 전',
        commentCount: 3,
    },
    {
        id: 4,
        gameId: 3,
        category: 'PREVIEW',
        title: 'SSG전 승률 어떻게 보세요',
        content: 'AI 예측 승률 60%라는데 실제로도 그럴지 궁금하네요',
        author: '데이터광',
        createdAt: '2시간 전',
        commentCount: 5,
    },
];
