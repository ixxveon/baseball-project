import React from 'react';
import { useLoginRedirect } from '../hooks/useLoginRedirect';

interface LoginRequiredNoticeProps {
    message: string;
}

export default function LoginRequiredNotice({ message }: LoginRequiredNoticeProps): React.JSX.Element {
    const goToLogin = useLoginRedirect();

    return (
        <div className="login-required-notice">
            <p className="login-required-message">{message}</p>
            <button type="button" className="login-required-btn" onClick={goToLogin}>
                로그인하고 AI 분석 보기
            </button>
        </div>
    );
}
