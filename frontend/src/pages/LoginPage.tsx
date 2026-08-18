import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function LoginPage(): React.JSX.Element {
    return (
        <AuthLayout title="로그인">
            <p className="auth-subtext">소셜 계정으로 간편하게 로그인하세요</p>
            <SocialLoginButtons />
            <p className="auth-switch-text">
                아직 계정이 없으신가요?{' '}
                <Link to="/signup" className="auth-switch-link">회원가입</Link>
            </p>
        </AuthLayout>
    );
}
