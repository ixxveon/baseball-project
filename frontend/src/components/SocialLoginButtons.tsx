import React from 'react';

interface SocialProvider {
    key: 'kakao' | 'naver' | 'google';
    label: string;
    className: string;
}

const PROVIDERS: SocialProvider[] = [
    { key: 'kakao', label: '카카오로 계속하기', className: 'social-btn kakao' },
    { key: 'naver', label: '네이버로 계속하기', className: 'social-btn naver' },
    { key: 'google', label: 'Google로 계속하기', className: 'social-btn google' },
];

export default function SocialLoginButtons(): React.JSX.Element {
    const handleClick = (provider: SocialProvider['key']): void => {
        window.location.href = `/oauth2/authorization/${provider}`;
    };

    return (
        <div className="social-btn-group">
            {PROVIDERS.map((provider) => (
                <button
                    key={provider.key}
                    type="button"
                    className={provider.className}
                    onClick={() => handleClick(provider.key)}
                >
                    {provider.label}
                </button>
            ))}
        </div>
    );
}
