export const RecommendationGrade = {
    S: 'S',
    A: 'A',
    B: 'B',
    C: 'C',
} as const;

export type RecommendationGrade = typeof RecommendationGrade[keyof typeof RecommendationGrade];

export const GRADE_COLORS: Record<RecommendationGrade, { bg: string; border: string }> = {
    S: { bg: '#ef4444', border: '#ef4444' },
    A: { bg: '#10b981', border: '#10b981' },
    B: { bg: '#3b82f6', border: '#3b82f6' },
    C: { bg: '#6b7280', border: '#6b7280' },
} as const;