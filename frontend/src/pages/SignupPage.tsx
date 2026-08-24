import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import AuthLayout from '../layouts/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { checkNicknameAvailability, signup, type SignupValidationErrors } from '../api/memberApi';

type NicknameCheckStatus = 'idle' | 'checking' | 'available' | 'duplicate';
type EmailVerifyStatus = 'idle' | 'sent' | 'verified';

interface FormState {
    email: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
    agreeTerms: boolean;
}

const INITIAL_FORM: FormState = {
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false,
};

function validate(form: FormState): SignupValidationErrors {
    const errors: SignupValidationErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = '올바른 이메일 형식이 아니에요';
    }

    const nicknameLength = form.nickname.trim().length;
    if (nicknameLength < 2 || nicknameLength > 10) {
        errors.nickname = '닉네임은 2~10자로 입력해주세요';
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
        errors.password = '영문, 숫자를 포함해 8자 이상 입력해주세요';
    }

    if (form.password && form.passwordConfirm && form.password !== form.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않아요';
    }

    return errors;
}

export default function SignupPage(): React.JSX.Element {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<SignupValidationErrors>({});
    const [submitError, setSubmitError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [nicknameCheckStatus, setNicknameCheckStatus] = useState<NicknameCheckStatus>('idle');
    const [checkedNickname, setCheckedNickname] = useState<string>('');
    const [emailVerifyStatus, setEmailVerifyStatus] = useState<EmailVerifyStatus>('idle');
    const [verificationCode, setVerificationCode] = useState<string>('');

    const handleChange = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const value = field === 'agreeTerms' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));

        if (field === 'nickname') {
            setNicknameCheckStatus('idle');
        }

        if (field === 'email') {
            setEmailVerifyStatus('idle');
            setVerificationCode('');
        }
    };

    const handleSendVerification = (): void => {
        setEmailVerifyStatus('sent');
    };

    const handleConfirmVerification = (): void => {
        setEmailVerifyStatus('verified');
    };

    const handleCheckNickname = async (): Promise<void> => {
        const nickname = form.nickname.trim();
        const nicknameLength = nickname.length;

        if (nicknameLength < 2 || nicknameLength > 10) {
            setErrors((prev) => ({ ...prev, nickname: '닉네임은 2~10자로 입력해주세요' }));
            return;
        }

        setErrors((prev) => ({ ...prev, nickname: undefined }));
        setNicknameCheckStatus('checking');
        try {
            const available = await checkNicknameAvailability(nickname);
            setNicknameCheckStatus(available ? 'available' : 'duplicate');
            setCheckedNickname(nickname);
        } catch {
            setNicknameCheckStatus('idle');
            setErrors((prev) => ({ ...prev, nickname: '중복 확인에 실패했어요. 다시 시도해주세요' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSubmitError('');

        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        if (!form.agreeTerms) {
            setSubmitError('이용약관에 동의해주세요');
            return;
        }

        if (nicknameCheckStatus !== 'available' || checkedNickname !== form.nickname.trim()) {
            setSubmitError('닉네임 중복 확인을 해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            await signup({
                email: form.email,
                nickname: form.nickname,
                password: form.password,
            });
            navigate('/login', { state: { signupSuccess: true } });
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const responseData = error.response.data as {
                    message?: string;
                    data?: SignupValidationErrors;
                };
                setSubmitError(responseData.message ?? '회원가입에 실패했어요. 잠시 후 다시 시도해주세요');
                if (responseData.data) {
                    setErrors((prev) => ({ ...prev, ...responseData.data }));
                }
            } else {
                setSubmitError('회원가입에 실패했어요. 잠시 후 다시 시도해주세요');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="회원가입">
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
                    {errors.email && <span className="auth-error">{errors.email}</span>}
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

                <div className="auth-field">
                    <label htmlFor="nickname">닉네임</label>
                    <div className="auth-field-row">
                        <input
                            id="nickname"
                            type="text"
                            value={form.nickname}
                            onChange={handleChange('nickname')}
                            placeholder="2~10자"
                        />
                        <button
                            type="button"
                            className="auth-check-btn"
                            onClick={handleCheckNickname}
                            disabled={nicknameCheckStatus === 'checking'}
                        >
                            {nicknameCheckStatus === 'checking' ? '확인 중...' : '중복확인'}
                        </button>
                    </div>
                    {errors.nickname && <span className="auth-error">{errors.nickname}</span>}
                    {nicknameCheckStatus === 'available' && (
                        <span className="auth-success">사용 가능한 닉네임이에요</span>
                    )}
                    {nicknameCheckStatus === 'duplicate' && (
                        <span className="auth-error">이미 사용 중인 닉네임이에요</span>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        placeholder="영문, 숫자 포함 8자 이상"
                    />
                    <span className="auth-hint">영문, 숫자를 포함해 8자 이상으로 만들어주세요</span>
                    {errors.password && <span className="auth-error">{errors.password}</span>}
                </div>

                <div className="auth-field">
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        value={form.passwordConfirm}
                        onChange={handleChange('passwordConfirm')}
                        placeholder="비밀번호 재입력"
                    />
                    {errors.passwordConfirm && <span className="auth-error">{errors.passwordConfirm}</span>}
                </div>

                <label className="auth-checkbox-row">
                    <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={handleChange('agreeTerms')}
                    />
                    <span>이용약관 및 개인정보처리방침에 동의합니다</span>
                </label>

                {submitError && <p className="auth-error auth-error-submit">{submitError}</p>}

                <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? '가입 중...' : '회원가입'}
                </button>
            </form>

            <div className="auth-divider"><span>또는</span></div>

            <SocialLoginButtons />

            <p className="auth-switch-text">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="auth-switch-link">로그인</Link>
            </p>
        </AuthLayout>
    );
}
