import React from 'react';

export default function MessageBubble({
    text,
    isOwn,
    timestamp,
    seen = false
}) {
    return (
        <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
            <div 
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn 
                    ? 'bg-[var(--color-primary)] text-white rounded-tr-sm' 
                    : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-tl-sm'
                }`}
            >
                {text}
            </div>
            
            <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                    {timestamp}
                </span>
                
                {isOwn && (
                    <span className="text-[14px]">
                       {seen ? (
                            <svg className="w-3.5 h-3.5 text-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                       ) : (
                            <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                       )}
                    </span>
                )}
            </div>
        </div>
    );
}
