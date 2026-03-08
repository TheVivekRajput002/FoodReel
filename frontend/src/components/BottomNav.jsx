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
            name: 'search',
            path: '/search',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            name: 'messages',
            path: '/messages',
            icon: (active) => (
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.24.364.466.037.892.281 1.153.671L12 21l2.65-3.978c.26-.39.687-.634 1.153-.67 1.091-.086 2.171-.208 3.24-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {/* PRD mentioned notification badge for unread count, let's add a static one for now as per design */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-black"></span>
                    </span>
                </div>
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
