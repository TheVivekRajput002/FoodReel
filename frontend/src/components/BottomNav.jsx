import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function BottomNav() {
    const location = useLocation()
    const currentPath = location.pathname

    const tabs = [
        {
            name: 'home',
            path: '/',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            ),
        },
        {
            name: 'saved',
            path: '/saved',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
            ),
        },
        {
            name: 'profile',
            path: '/profile',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            ),
        },
    ]

    return (
        <nav className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-2 flex items-center justify-around z-50 shrink-0">
            {tabs.map(tab => {
                const isActive = currentPath === tab.path
                return (
                    <Link
                        key={tab.name}
                        to={tab.path}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
                    >
                        {tab.icon(isActive)}
                        <span className="text-[10px] font-medium">{tab.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default BottomNav
