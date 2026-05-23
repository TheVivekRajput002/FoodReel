import React from 'react'
import HomeReels from '../components/HomeReels'

function Home() {
    return (
        <div className="h-[calc(100dvh-60px)] w-full bg-[var(--color-bg)] flex flex-col relative md:h-[100dvh]">

            {/* ── Reels Feed (takes full height minus bottom nav) ── */}
            <main className="flex-1 overflow-hidden">
                <HomeReels />
            </main>

        </div>
    )
}

export default Home
