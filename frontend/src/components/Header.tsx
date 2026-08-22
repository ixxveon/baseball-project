import React from 'react';
import { Link } from 'react-router-dom';
import type { HeaderProps, TabType } from '../types';

export default function Header({ activeTab, onTabChange }: HeaderProps): React.JSX.Element {
    const navItems: { id: TabType; label: string }[] = [
        { id: 'home', label: '홈' },
        { id: 'recommend', label: '직관 추천' },
        { id: 'ranking', label: '랭킹' },
        { id: 'community', label: '커뮤니티' },
    ];

    return (
        <header className="header-wrapper" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: '#111827',
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
            <div className="header-content" style={{
                maxWidth: '1600px', // 메인 컨테이너와 동일한 너비 적용
                width: '100%',
                margin: '0 auto',
                padding: '0 40px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
            }}>
                {/* 좌측 로고 */}
                <div
                    className="logo"
                    onClick={() => onTabChange('home')}
                    style={{
                        fontSize: '20px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        letterSpacing: '-0.5px',
                        flexShrink: 0
                    }}
                >
                    <span style={{ color: '#e11d48' }}>위닝</span>
                    <span style={{ color: '#ffffff' }}>PICK</span>
                </div>

                {/* 중앙 탭 메뉴 */}
                <nav className="nav-tabs" style={{ display: 'flex', gap: '32px', height: '100%' }}>
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onTabChange(item.id)}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: isActive ? '#ffffff' : '#9ca3af',
                                    fontWeight: isActive ? '800' : '600',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    padding: '0 4px',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                {item.label}
                                {isActive && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '3px',
                                        backgroundColor: '#e11d48',
                                        borderRadius: '2px 2px 0 0'
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* 우측 알림 및 로그인 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                    <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px' }}>🔔</span>
                        <span style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-6px',
                            backgroundColor: '#e11d48',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            3
                        </span>
                    </div>

                    <Link
                        to="/login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: 0
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
                        </svg>
                        <span>로그인</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}