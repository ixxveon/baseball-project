import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import AuthLayout from '../layouts/AuthLayout';
import { confirmEmailVerification, resetPassword, sendEmailVerification } from '../api/memberApi';

type EmailVerifyStatus = 'idle' | 'sent' | 'verified';

interface FormState {
    email: string;
    newPassword: string;
    newPasswordConfirm: string;
}

const INITIAL_FORM: FormState = { email: '', newPassword: '', newPasswordConfirm: '' };

function validatePassword(password: string): string | undefined {
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
        return '영문, 숫자를 포함해 8자 이상 입력해주세요';
    }
    return undefined;
}

export default function ForgotPasswordPage(): React.JSX.Element {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [passwordError, setPasswordError] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [emailVerifyStatus, setEmailVerifyStatus] = useState<EmailVerifyStatus>('idle');
    const [verificationCode, setVerificationCode] = useState<string>('');

    const handleChange = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (field === 'email') {
            setEmailVerifyStatus('idle');
            setVerificationCode('');
        }
    };

    const handleSendVerification = async (): Promise<void> => {
        try {
            await sendEmailVerification(form.email);
            setEmailVerifyStatus('sent');
        } catch {
            setSubmitError('인증번호 발송에 실패했어요. 다시 시도해주세요.');
        }
    };

    const handleConfirmVerification = async (): Promise<void> => {
        try {
            const verified = await confirmEmailVerification(form.email, verificationCode);
            if (verified) {
                setEmailVerifyStatus('verified');
            } else {
                setSubmitError('인증번호가 올바르지 않아요');
            }
        } catch {
            setSubmitError('인증 확인에 실패했어요. 다시 시도해주세요');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSubmitError('');

        if (emailVerifyStatus !== 'verified') {
            setSubmitError('이메일 인증을 완료해주세요');
            return;
        }

        const error = validatePassword(form.newPassword);
        setPasswordError(error ?? '');
        if (error) {
            return;
        }

        if (form.newPassword !== form.newPasswordConfirm) {
            setSubmitError('비밀번호가 일치하지 않아요');
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword(form.email, form.newPassword);
            navigate('/login', { state: { passwordResetSuccess: true } });
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const responseData = error.response.data as { message?: string };
                setSubmitError(responseData.message ?? '비밀번호 재설정에 실패했어요. 잠시 후 다시 시도해주세요');
            } else {
                setSubmitError('비밀번호 재설정에 실패했어요. 잠시 후 다시 시도해주세요');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="비밀번호 찾기">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                    <label htmlFor="email">이메일</label>
                    <div className="auth-field-row">
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange('email')}
                            placeholder="example@email.com"
                        />
                        <button
                            type="button"
                            className="auth-check-btn"
                            onClick={handleSendVerification}
                            disabled={emailVerifyStatus !== 'idle'}
                        >
                            인증번호 발송
                        </button>
                    </div>
                </div>

                {emailVerifyStatus !== 'idle' && (
                    <div className="auth-field">
                        <label htmlFor="verificationCode">인증번호</label>
                        <div className="auth-field-row">
                            <input
                                id="verificationCode"
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="인증번호 6자리"
                                disabled={emailVerifyStatus === 'verified'}
                            />
                            <button
                                type="button"
                                className="auth-check-btn"
                                onClick={handleConfirmVerification}
                                disabled={emailVerifyStatus === 'verified'}
                            >
                                확인
                            </button>
                        </div>
                        {emailVerifyStatus === 'sent' && (
                            <span className="auth-success">인증번호를 발송했어요</span>
                        )}
                        {emailVerifyStatus === 'verified' && (
                            <span className="auth-success">이메일 인증이 완료됐어요</span>
                        )}
                    </div>
                )}

                {emailVerifyStatus === 'verified' && (
                    <>
                        <div className="auth-field">
                            <label htmlFor="newPassword">새 비밀번호</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange('newPassword')}
                                placeholder="영문, 숫자 포함 8자 이상"
                            />
                            <span className="auth-hint">영문, 숫자를 포함해 8자 이상으로 만들어주세요</span>
                            {passwordError && <span className="auth-error">{passwordError}</span>}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
                            <input
                                id="newPasswordConfirm"
                                type="password"
                                value={form.newPasswordConfirm}
                                onChange={handleChange('newPasswordConfirm')}
                                placeholder="비밀번호 재입력"
                            />
                        </div>
                    </>
                )}

                {submitError && <p className="auth-error auth-error-submit">{submitError}</p>}

                <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                </button>
            </form>

            <p className="auth-switch-text">
                <Link to="/login" className="auth-switch-link">로그인으로 돌아가기</Link>
            </p>
        </AuthLayout>
    );
}