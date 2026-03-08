import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function UserProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:3000/api/auth/user/profile", { withCredentials: true })
            .then(response => {
                setUser(response.data.user)
                setLoading(false)
            })
            .catch(err => {
                setError("Not logged in")
                setLoading(false)
            })
    }, [])

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:3000/api/auth/user/logout", { withCredentials: true })
            navigate("/user/login")
        } catch (errorLogMsg) {
            console.error("Logout failed", errorLogMsg)
        }
    }

    if (loading) {
        return (
            <div className="h-[100dvh] w-full bg-black flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="h-[100dvh] w-full bg-black flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <p className="text-white/40 text-base font-medium">You're not logged in</p>
                    <button
                        onClick={() => navigate('/user/login')}
                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-8 rounded-full transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        )
    }

    // Inlined memberSince into the JSX below

    return (
        <div className="h-[100dvh] w-full bg-black flex flex-col">

            {/* ── Content ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 pt-14 pb-20">

                {/* Avatar + Name */}
                <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-500/20">
                        {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center">
                        <h1 className="text-white text-xl font-bold">{user.fullName}</h1>
                        <p className="text-white/40 text-sm mt-0.5">{user.email}</p>
                    </div>
                </div>

                {/* ── Profile Tabs ─────────────────────────────── */}
                <div className="flex border-b border-[var(--color-border)] mb-4 sticky top-0 bg-[var(--color-bg)] z-10">
                    {['Posts', 'Reels', 'Tagged', 'Saved'].map((tab, idx) => (
                        <button 
                            key={tab}
                            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                                idx === 0 
                                ? 'border-[var(--color-primary)] text-[var(--color-text-primary)]' 
                                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Posts Grid (Stub) ───────────────────────── */}
                <div className="grid grid-cols-3 gap-1 mb-8">
                    {[1, 2, 3, 4, 5, 6].map(item => (
                        <div key={item} className="aspect-square bg-[var(--color-surface-2)] relative group cursor-pointer">
                            {/* Placeholder for real images */}
                            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Logout Button ──────────────────────────── */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-danger)] font-semibold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-red-500/5 mt-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Logout
                </button>
            </div>

        </div>
    )
}

export default UserProfile
