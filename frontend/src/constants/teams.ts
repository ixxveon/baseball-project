export const KBO_TEAMS = [
    { id: 1, name: 'LG 트윈스' },
    { id: 2, name: '두산 베어스' },
    { id: 3, name: 'KT 위즈' },
    { id: 4, name: 'SSG 랜더스' },
    { id: 5, name: 'NC 다이노스' },
    { id: 6, name: '삼성 라이온즈' },
    { id: 7, name: '롯데 자이언츠' },
    { id: 8, name: '한화 이글스' },
    { id: 9, name: 'KIA 타이거즈' },
    { id: 10, name: '키움 히어로즈' },
] as const;

export type TeamName = typeof KBO_TEAMS[number]['name'];

export const DEFAULT_FAVORITE_TEAM: TeamName = '삼성 라이온즈';