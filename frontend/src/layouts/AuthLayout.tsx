import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps): React.JSX.Element {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="brand auth-brand">
                    <span className="brand-main">위닝</span>
                    <span className="brand-sub-dark">PICK</span>
                </Link>
                <h1 className="auth-title">{title}</h1>
                {children}
            </div>
        </div>
    );
}
