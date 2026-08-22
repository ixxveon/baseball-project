import React from 'react';

interface BackButtonProps {
    label: string;
    onClick: () => void;
}

export default function BackButton({ label, onClick }: BackButtonProps): React.JSX.Element {
    return (
        <button type="button" className="back-btn" onClick={onClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>{label}</span>
        </button>
    );
}
