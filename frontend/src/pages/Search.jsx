import React from 'react';
import TopBar from '../components/TopBar';

export default function Search() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-bg)] w-full">
            <TopBar title="Search" />
            
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Discover Food</h2>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-xs">
                    Search functionality is currently a stub for the UI prototype phase.
                </p>
            </main>
        </div>
    );
}
