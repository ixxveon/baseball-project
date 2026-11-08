import { useState } from 'react';
import { confirmEmailVerification, sendEmailVerification } from '../api/memberApi';
import { getApiErrorMessage } from '../utils/apiError';

export type EmailVerifyStatus = 'idle' | 'sent' | 'verified';

interface EmailVerification {
    status: EmailVerifyStatus;
    code: string;
    setCode: (code: string) => void;
    isSending: boolean;
    sendButtonLabel: string;
    sendCode: (email: string) => Promise<void>;
    confirmCode: (email: string) => Promise<void>;
    reset: () => void;
}

export function useEmailVerification(setError: (message: string) => void): EmailVerification {
    const [status, setStatus] = useState<EmailVerifyStatus>('idle');
    const [code, setCode] = useState('');
    const [isSending, setIsSending] = useState(false);

    const sendCode = async (email: string): Promise<void> => {
        setError('');
        setIsSending(true);
        try {
            await sendEmailVerification(email);
            setStatus('sent');
            setCode('');
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
    };

    const sendButtonLabel = status === 'idle' ? '인증번호 발송' : '재전송';

    return { status, code, setCode, isSending, sendButtonLabel, sendCode, confirmCode, reset };
}
