import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps): React.JSX.Element {
    return (
        <div className="auth-page">
            <Link to="/" className="auth-home-link" aria-label="홈으로">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                </svg>
            </Link>
            <div className="auth-card">
                <div className="brand auth-brand">
                    <span className="brand-main">위닝</span>
                    <span className="brand-sub-dark">PICK</span>
                </div>
                <h1 className="auth-title">{title}</h1>
                {children}
            </div>
        </div>
    );
}
