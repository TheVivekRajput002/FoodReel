import React from 'react'
import HomeReels from '../components/HomeReels'

function Home() {
    return (
        <div className="h-[100dvh] w-full bg-black flex flex-col relative">

            {/* ── Reels Feed (takes full height minus bottom nav) ── */}
            <main className="flex-1 overflow-hidden">
                <HomeReels />
            </main>

        </div>
    )
}

export default Home
