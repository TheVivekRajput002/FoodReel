import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpenText, House, MessageCircle, Plus, Search, Trophy, User, Video } from 'lucide-react'

function BottomNav({ canCreate, onCreateClick }) {
    const location = useLocation()
    const currentPath = location.pathname
    const role = localStorage.getItem('scs_role')
    const profilePath = role === 'creator' ? '/creator/profile' : '/user/profile'
    const isCreator = role === 'creator'

    const tabs = isCreator
        ? [
            {
                name: 'reels',
                path: '/creator/reels',
                icon: () => <Video className="h-6 w-6" />,
            },
            ...(canCreate
                ? [{
                    name: 'create',
                    isCreateAction: true,
                    icon: () => <Plus className="h-6 w-6" />,
                }]
                : []),
            {
                name: 'messages',
                path: '/messages',
                icon: () => (
                    <div className="relative">
                        <MessageCircle className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-error)] opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-error)]" />
                        </span>
                    </div>
                ),
            },
            {
                name: 'profile',
                path: profilePath,
                icon: () => <User className="h-6 w-6" />,
            },
        ]
        : [
            {
                name: 'home',
                path: '/',
                icon: () => <House className="h-6 w-6" />,
            },
            {
                name: 'search',
                path: '/search',
                icon: () => <Search className="h-6 w-6" />,
            },
            {
                name: 'stack',
                path: '/stack',
                icon: () => <BookOpenText className="h-6 w-6" />,
            },
            {
                name: 'achievements',
                path: '/achievements',
                icon: () => <Trophy className="h-6 w-6" />,
            },
            {
                name: 'messages',
                path: '/messages',
                icon: () => (
                    <div className="relative">
                        <MessageCircle className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-error)] opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-error)]" />
                        </span>
                    </div>
                ),
            },
            {
                name: 'profile',
                path: profilePath,
                icon: () => <User className="h-6 w-6" />,
            },
        ]

    return (
        <nav className="w-full bg-[var(--color-navbar-bg)] backdrop-blur-md border-t border-[var(--color-navbar-border)] px-6 py-4 flex items-center justify-around z-50 shrink-0">
            {tabs.map(tab => {
                if (tab.isCreateAction) {
                    return (
                        <button
                            key={tab.name}
                            type="button"
                            onClick={onCreateClick}
                            className="flex flex-col items-center gap-1 text-[var(--color-text-on-primary)] transition-colors hover:text-[var(--color-text-on-primary)]"
                        >
                            {tab.icon(false)}
                            {/* <span className="text-[10px] font-medium">{tab.name}</span> */}
                        </button>
                    )
                }

                const isActive = tab.path === '/messages' ? currentPath.startsWith('/messages') : currentPath === tab.path
                return (
                    <Link
                        key={tab.name}
                        to={tab.path}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive
                            ? 'text-[var(--color-text-on-primary)]'
                            : 'text-[var(--color-text-on-primary)]/70 hover:text-[var(--color-text-on-primary)]'
                            }`}
                    >
                        {tab.icon()}
                        {/* <span className="text-[10px] font-medium">{tab.name}</span> */}
                    </Link>
                )
            })}
        </nav>
    )
}

export default BottomNav
