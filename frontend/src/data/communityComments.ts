import type { PostComment } from '../types';

export const communityCommentsData: PostComment[] = [
    { id: 1, postId: 1, author: '두산팬', content: '오늘은 저희가 이길 것 같은데요 ㅎㅎ', createdAt: '8분 전' },
    { id: 2, postId: 1, author: '엘지사랑', content: '선발 컨디션 좋아보여요 기대됩니다', createdAt: '5분 전' },
    { id: 3, postId: 1, author: '야구광', content: '오늘 직관가는데 떨리네요', createdAt: '2분 전' },
    { id: 4, postId: 2, author: '잠실주민', content: '오늘 진짜 사람 많던데 어디 앉으셨어요?', createdAt: '20분 전' },
    { id: 5, postId: 2, author: '트윈스팬', content: '저도 3루측이었는데 못 뵀네요 ㅋㅋ', createdAt: '15분 전' },
    { id: 6, postId: 3, author: '초행길', content: '잠실 롯데월드 주차장이 그나마 싸요', createdAt: '40분 전' },
];
