import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import AuthLayout from '../layouts/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { login } from '../api/memberApi';
import { saveAccessToken } from '../utils/tokenStorage';

interface FormState {
    email: string;
    password: string;
}

const INITIAL_FORM: FormState = { email: '', password: '' };

export default function LoginPage(): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const signupSuccess = Boolean((location.state as { signupSuccess?: boolean } | null)?.signupSuccess);

    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [submitError, setSubmitError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSubmitError('');

        if (!form.email || !form.password) {
            setSubmitError('이메일과 비밀번호를 입력해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            const { accessToken } = await login(form);
            saveAccessToken(accessToken);
            navigate('/mypage');
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const responseData = error.response.data as { message?: string };
                setSubmitError(responseData.message ?? '로그인에 실패했어요. 잠시 후 다시 시도해주세요');
            } else {
                setSubmitError('로그인에 실패했어요. 잠시 후 다시 시도해주세요');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="로그인">
            {signupSuccess && (
                <p className="auth-banner">회원가입이 완료됐어요! 로그인해주세요</p>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="example@email.com"
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        placeholder="비밀번호"
                    />
                </div>

                {submitError && <p className="auth-error auth-error-submit">{submitError}</p>}

                <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className="auth-divider"><span>또는</span></div>

            <SocialLoginButtons />

            <p className="auth-switch-text">
                아직 계정이 없으신가요?{' '}
                <Link to="/signup" className="auth-switch-link">회원가입</Link>
            </p>
        </AuthLayout>
    );
}
