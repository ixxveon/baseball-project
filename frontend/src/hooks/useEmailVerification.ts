import { useEffect, useState } from 'react';
import { confirmEmailVerification, sendEmailVerification } from '../api/memberApi';
import { getApiErrorMessage } from '../utils/apiError';

export type EmailVerifyStatus = 'idle' | 'sent' | 'verified';

// 백엔드 MemberService.VERIFICATION_CODE_TTL(5분)과 맞춘다
const VERIFICATION_CODE_TTL_SECONDS = 5 * 60;

interface EmailVerification {
    status: EmailVerifyStatus;
    code: string;
    setCode: (code: string) => void;
    isSending: boolean;
    sendButtonLabel: string;
    remainingLabel: string;
    isExpired: boolean;
    sendCode: (email: string) => Promise<void>;
    confirmCode: (email: string) => Promise<void>;
    reset: () => void;
}

function formatRemaining(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function useEmailVerification(setError: (message: string) => void): EmailVerification {
    const [status, setStatus] = useState<EmailVerifyStatus>('idle');
    const [code, setCode] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    // 남은 시간은 1씩 빼지 않고 만료 시각과 현재 시각의 차이로 계산해, 탭이 백그라운드여서 타이머가 늦게 돌아도 정확하게 유지한다
    useEffect(() => {
        if (status !== 'sent' || expiresAt === null) {
            return;
        }

        const timerId = window.setInterval(() => {
            const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
            setRemainingSeconds(remaining);
            if (remaining === 0) {
                window.clearInterval(timerId);
            }
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [status, expiresAt]);

    const sendCode = async (email: string): Promise<void> => {
        setError('');
        setIsSending(true);
        try {
            await sendEmailVerification(email);
            setStatus('sent');
            setCode('');
            setExpiresAt(Date.now() + VERIFICATION_CODE_TTL_SECONDS * 1000);
            setRemainingSeconds(VERIFICATION_CODE_TTL_SECONDS);
        } catch (error: unknown) {
            setError(getApiErrorMessage(error, '인증번호 발송에 실패했어요. 다시 시도해주세요'));
        } finally {
            setIsSending(false);
        }
    };

    const confirmCode = async (email: string): Promise<void> => {
        setError('');
        try {
            const verified = await confirmEmailVerification(email, code);
            if (verified) {
                setStatus('verified');
            } else {
                setError('인증번호가 올바르지 않아요');
            }
        } catch (error: unknown) {
            setError(getApiErrorMessage(error, '인증 확인에 실패했어요. 다시 시도해주세요'));
        }
    };

    const reset = (): void => {
        setStatus('idle');
        setCode('');
        setExpiresAt(null);
    };

    const sendButtonLabel = status === 'idle' ? '인증번호 발송' : '재전송';
    const isExpired = status === 'sent' && remainingSeconds === 0;
    const remainingLabel = formatRemaining(remainingSeconds);

    return { status, code, setCode, isSending, sendButtonLabel, remainingLabel, isExpired, sendCode, confirmCode, reset };
}
