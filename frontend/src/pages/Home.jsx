import React from 'react'
import { useEffect } from "react"
import HomeReels from '../components/HomeReels'

function Home() {

    useEffect(() => {
        const wakeBackend = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/api/health`)
                console.log("Backend awake");
            } catch (error) {
                console.log("Wakeup failed");
            }
        };

        wakeBackend();
    }, [])

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
