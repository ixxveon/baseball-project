import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function SignupPage(): React.JSX.Element {
    return (
        <AuthLayout title="회원가입">
            <p className="auth-subtext">
                소셜 계정으로 로그인하면 별도 절차 없이 자동으로 가입돼요
            </p>
            <SocialLoginButtons />
            <p className="auth-switch-text">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="auth-switch-link">로그인</Link>
            </p>
        </AuthLayout>
    );
}
