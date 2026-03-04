import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BottomNav from '../components/BottomNav'

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
        } catch (err) {
            console.error("Logout failed", err)
        }
    }

    if (loading) {
        return (
            <div className="h-[100dvh] w-full bg-black flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
                <BottomNav />
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
                <BottomNav />
            </div>
        )
    }

    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

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

                {/* ── Info Cards ─────────────────────────────── */}
                <div className="space-y-3">
                    {/* Full Name */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Full Name</p>
                            <p className="text-white text-sm font-medium mt-0.5">{user.fullName}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Email</p>
                            <p className="text-white text-sm font-medium mt-0.5">{user.email}</p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Member Since</p>
                            <p className="text-white text-sm font-medium mt-0.5">{memberSince}</p>
                        </div>
                    </div>
                </div>

                {/* ── Logout Button ──────────────────────────── */}
                <button
                    onClick={handleLogout}
                    className="mt-8 w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-3 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* ── Bottom Nav ─────────────────────────────────── */}
            <BottomNav />
        </div>
    )
}

export default UserProfile
