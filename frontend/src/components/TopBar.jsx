import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ 
    title, 
    showBack = false, 
    rightElement = null 
}) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 w-full bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-1 rounded-full hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-primary)]"
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <h1 className="text-lg font-bold text-[var(--color-text-primary)] truncate">{title}</h1>
            </div>
            {rightElement && (
                <div className="flex items-center">
                    {rightElement}
                </div>
            )}
        </header>
    );
}
