import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import HomeReels from '../components/HomeReels'

function Home() {
    return (
        <div className="h-[100dvh] w-full bg-black flex flex-col relative">

            {/* ── Reels Feed (takes full height minus bottom nav) ── */}
            <main className="flex-1 overflow-hidden">
                <HomeReels />
            </main>

            {/* ── Bottom Navbar ─────────────────────────────────── */}
            <nav className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-2 flex items-center justify-around z-50 shrink-0">
                <Link to="/" className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors">
                    {/* Home icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="text-[10px] font-medium">home</span>
                </Link>

                <Link to="/saved" className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors">
                    {/* Saved / Bookmark icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
                    </svg>
                    <span className="text-[10px] font-medium">saved</span>
                </Link>
            </nav>
        </div>
    )
}

export default Home
