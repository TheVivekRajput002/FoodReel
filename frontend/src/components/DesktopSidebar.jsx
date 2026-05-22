import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpenText, House, MessageCircle, Plus, Search, Trophy, User, Video } from 'lucide-react';

export default function DesktopSidebar({ canCreate, onCreateClick, themeMode, onToggleTheme }) {
    const { pathname } = useLocation();
    const role = localStorage.getItem('scs_role');
    const profilePath = role === 'creator' ? '/creator/profile' : '/user/profile';
    const isCreator = role === 'creator';

    const tabs = isCreator
        ? [
            { name: 'Reels', path: '/creator/reels', icon: Video },
            { name: 'Messages', path: '/messages', icon: MessageCircle },
            { name: 'Profile', path: profilePath, icon: User },
        ]
        : [
            { name: 'Home', path: '/', icon: House },
            { name: 'Search', path: '/search', icon: Search },
            { name: 'Stack', path: '/stack', icon: BookOpenText },
            { name: 'Achievements', path: '/achievements', icon: Trophy },
            { name: 'Messages', path: '/messages', icon: MessageCircle },
            { name: 'Profile', path: profilePath, icon: User },
        ];

    return (
        <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[86px] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-navbar-border)] z-40 flex-col items-center py-6">
            <div className="mb-8">
                <div className="w-11 h-11 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-primary)] text-sm font-bold">
                    SCS
                </div>
            </div>

            <nav className="flex-1 flex flex-col items-center gap-3">
                {tabs.map((tab) => {
                    const isActive = tab.path === '/messages' ? pathname.startsWith('/messages') : pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            title={tab.name}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                isActive ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            <Icon className="h-7 w-7" />
                        </Link>
                    );
                })}

                {canCreate && (
                    <button
                        type="button"
                        title="Create"
                        onClick={onCreateClick}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]"
                    >
                        <Plus className="h-7 w-7" />
                    </button>
                )}
            </nav>

            <div className="flex flex-col items-center gap-3">
                <button
                    type="button"
                    title="Toggle theme"
                    onClick={onToggleTheme}
                    className="w-12 h-12 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors flex items-center justify-center"
                >
                    {themeMode === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v1.5m0 13.5v1.5M5.636 5.636l1.06 1.06m9.608 9.608 1.06 1.06M3.75 12h1.5m13.5 0h1.5M5.636 18.364l1.06-1.06m9.608-9.608 1.06-1.06M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                        </svg>
                    )}
                </button>

            </div>
        </aside>
    );
}
