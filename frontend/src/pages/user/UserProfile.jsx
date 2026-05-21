import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Settings } from 'lucide-react'

const PROFILE_STATS = {
    posts: 14,
    followers: 547,
    following: 752,
}

const PROFILE_HIGHLIGHTS = [
    {
        id: 1,
        title: 'IIT Kanpur...',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=240&q=80',
    },
    {
        id: 2,
        title: 'huhhh?',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=240&q=80',
    },
    {
        id: 3,
        title: 'Me*',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80',
    },
    {
        id: 4,
        title: 'November...',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=240&q=80',
    },
]

const PROFILE_POSTS = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
]

function StatItem({ value, label }) {
    return (
        <div className="min-w-[72px] text-center">
            <p className="text-[20px] font-semibold leading-6 text-[var(--color-text-primary)]">{value}</p>
            <p className="mt-0.5 text-[16px] leading-5 text-[var(--color-text-primary)]">{label}</p>
        </div>
    )
}

function UserProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [savedReels, setSavedReels] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/profile`, { withCredentials: true })
            .then(response => {
                setUser(response.data.user)
                setLoading(false)
            })
            .catch(() => {
                setError('Not logged in')
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/reel/savedReels`, { withCredentials: true })
            .then(response => {
                setSavedReels(response.data.savedReels)
            })
            .catch(() => {
                setError('Not logged in')
            })
    }, [])

    console.log(savedReels)

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/logout`, { withCredentials: true })
            localStorage.removeItem('scs_auth')
            navigate('/user/login')
        } catch (errorLogMsg) {
            console.error('Logout failed', errorLogMsg)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[100dvh] w-full flex-col bg-[var(--color-bg)]">
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="flex h-[100dvh] w-full flex-col bg-[var(--color-bg)]">
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <p className="text-base font-medium text-[var(--color-text-secondary)]">You are not logged in</p>
                    <button
                        onClick={() => navigate('/user/login')}
                        className="mt-2 rounded-full bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold text-[var(--color-text-on-primary)] transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        )
    }

    const profileName = user.name || 'Vivek Rajput'
    const username = user.username || 'tvr002'
    const followingCount = user.followingCount || '404'
    const profileImage = user.profile_picture || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    const bio = 'plus ultra !'
    const insightsLead = '1.9k views in the last 30 days.'
    const insightsCta = 'View Insights'

    return (
        <div className="min-h-[100dvh] w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-[935px] pb-24 md:px-10 md:pb-10">
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 md:static md:h-auto md:border-b-0 md:px-0 md:pt-8">
                    <button type="button" className="flex h-8 w-8 items-center justify-center text-[var(--color-text-primary)] md:hidden" aria-label="Settings">
                        <Settings />
                    </button>

                    <div className="flex items-center gap-1.5 md:hidden">
                        <h1 className="text-[16px] font-semibold leading-6 tracking-[-0.01em] md:text-[16px]">{username}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                        </svg>
                    </div>

                    <button type="button" className="flex h-8 w-8 items-center justify-center text-[var(--color-text-primary)] md:hidden" aria-label="Threads">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.56 11.8c-.16-.08-.33-.15-.5-.21-.05-1.82-.67-3.26-1.84-4.27-1.2-1.04-2.82-1.51-4.83-1.4-1.54.08-2.82.62-3.8 1.59C4.6 8.48 4.08 9.74 4.05 11.2c-.03 1.42.39 2.69 1.24 3.78.84 1.07 2.02 1.76 3.5 2.04 1.1.2 2.15.18 3.11-.08.97-.26 1.78-.72 2.4-1.37.63-.66 1-1.46 1.1-2.39.72.42 1.18 1 1.36 1.72.18.75.02 1.48-.49 2.18-.5.7-1.31 1.21-2.4 1.52-1.07.31-2.38.36-3.89.14-1.87-.28-3.4-.95-4.56-2.01-1.16-1.06-1.9-2.39-2.2-3.96-.3-1.59-.12-3.15.53-4.63.65-1.48 1.68-2.69 3.05-3.6C8.17 2.64 9.83 2.14 11.7 2.1c2.2-.05 4.08.5 5.57 1.62 1.54 1.16 2.45 2.8 2.7 4.88.14 1.19.06 2.2-.24 3 .61.33 1.08.77 1.39 1.3.35.6.53 1.29.53 2.06 0 .84-.2 1.62-.61 2.31-.4.69-.98 1.27-1.73 1.71-.74.44-1.62.74-2.62.89l-.32-1.67c1.07-.17 1.89-.54 2.45-1.1.58-.59.88-1.28.88-2.08 0-.65-.21-1.18-.63-1.58-.41-.4-.91-.72-1.51-.95-.28.54-.66 1.02-1.12 1.44-.63.58-1.39 1.01-2.25 1.25-.85.24-1.76.27-2.69.1-.98-.18-1.76-.61-2.33-1.27-.58-.67-.86-1.43-.82-2.27.05-.92.44-1.67 1.16-2.23.71-.56 1.64-.88 2.77-.96 1.21-.08 2.35.05 3.38.38a7 7 0 0 1 .72.29c-.02-.79-.22-1.45-.61-1.95-.39-.5-.95-.88-1.67-1.12-.73-.24-1.6-.33-2.58-.28-.92.05-1.71.33-2.35.84-.62.49-1.04 1.17-1.22 2.02l-1.69-.36c.25-1.19.83-2.18 1.72-2.93.9-.76 2.03-1.18 3.38-1.25 1.5-.08 2.81.13 3.89.62 1.08.49 1.91 1.23 2.45 2.19.54.95.77 2.08.7 3.35.12.05.24.09.35.14Zm-2.95 1.12c-.95-.32-1.98-.44-3.07-.37-.73.05-1.3.22-1.69.51-.36.27-.55.61-.57 1.03-.02.37.11.7.39 1 .29.31.69.51 1.2.61.88.16 1.67.09 2.34-.22.68-.31 1.15-.82 1.4-1.52.12-.31.21-.66.25-1.04.03 0-.08 0-.25 0Z" />
                        </svg>
                    </button>

                    <div className="hidden items-center justify-between md:flex md:w-full">
                        <div className="flex items-center gap-4">
                            <h1 className="text-[28px] font-normal leading-8">{username}</h1>
                            <button
                                onClick={() => navigate('/user/profile/edit')}
                                className="h-8 rounded-lg bg-[var(--color-surface)] px-4 text-sm font-semibold text-[var(--color-text-primary)]"
                            >
                                Edit profile
                            </button>
                            <button className="h-8 rounded-lg bg-[var(--color-surface)] px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                                View archive
                            </button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)]"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="px-4 pt-4 md:px-0 md:pt-10">
                    <section className="md:hidden">
                        <div className="grid grid-cols-[96px_1fr] items-center gap-x-4">
                            <div className="flex justify-start">
                                <div className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                    <img src={profileImage} alt={profileName} className="block h-full w-full object-cover object-center" />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <StatItem value={PROFILE_STATS.posts} label="posts" />
                                    <StatItem value={PROFILE_STATS.followers} label="followers" />
                                    <StatItem value={followingCount} label="following" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-[16px] font-semibold leading-5">{user.name}</p>
                            <p className="mt-1 text-[16px] leading-5 text-[var(--color-text-primary)]">{user.bio}</p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/user/profile/edit')}
                                className="h-10 rounded-xl bg-[var(--color-surface)] px-4 text-[17px] font-semibold text-[var(--color-text-primary)]"
                            >
                                Edit Profile
                            </button>
                            <button className="h-10 rounded-xl bg-[var(--color-surface)] px-4 text-[17px] font-semibold text-[var(--color-text-primary)]">
                                View archive
                            </button>
                        </div>

                        <p className="mt-4 text-[15px] leading-5 text-[var(--color-text-primary)]">
                            {insightsLead} <span className="font-semibold">{insightsCta}</span>
                        </p>
                    </section>

                    <section className="hidden md:grid md:grid-cols-[291px_1fr] md:gap-x-24">
                        <div className="flex justify-center">
                            <div className="h-[150px] w-[150px] overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                <img src={profileImage} alt={profileName} className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <div>
                            <div className="mt-3 flex items-center gap-10">
                                <p className="text-base"><span className="font-semibold">{PROFILE_STATS.posts}</span> posts</p>
                                <p className="text-base"><span className="font-semibold">{PROFILE_STATS.followers}</span> followers</p>
                                <p className="text-base"><span className="font-semibold">{PROFILE_STATS.following}</span> following</p>
                            </div>
                            <div className="mt-5">
                                <p className="text-sm font-semibold">{profileName}</p>
                                <p className="mt-1 text-sm text-[var(--color-text-primary)]">{bio}</p>
                                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{user.email}</p>
                            </div>
                            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{insightsLead} {insightsCta}</p>
                        </div>
                    </section>

                    <section className="mt-6 flex gap-4 overflow-x-auto pb-2 md:mt-11 md:gap-6">
                        {PROFILE_HIGHLIGHTS.map((item) => (
                            <div key={item.id} className="w-[72px] shrink-0 text-center md:w-[84px]">
                                <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border-strong)] p-[3px] md:h-[84px] md:w-[84px]">
                                    <div className="h-full w-full overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                    </div>
                                </div>
                                <p className="mt-1.5 truncate text-[12px] font-medium leading-4 text-[var(--color-text-primary)]">{item.title}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <section className="mt-5 border-t border-[var(--color-border)]">
                    <div className="grid grid-cols-4">
                        <button className="flex h-11 items-center justify-center border-t border-[var(--color-text-primary)] text-[var(--color-text-primary)] md:h-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h6.5v6.5h-6.5zm0 10h6.5v6.5h-6.5zm10-10h6.5v6.5h-6.5zm0 10h6.5v6.5h-6.5z" />
                            </svg>
                        </button>
                        <button className="flex h-11 items-center justify-center text-[var(--color-text-muted)] md:h-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />
                            </svg>
                        </button>
                        <button className="flex h-11 items-center justify-center text-[var(--color-text-muted)] md:h-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 4l-6 6M4 20l6-6" />
                            </svg>
                        </button>
                        <button className="flex h-11 items-center justify-center text-[var(--color-text-muted)] md:h-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-3 gap-[1px] bg-[var(--color-border)]">
                    {savedReels.map((item) => (
                        <div key={item._id} className="relative aspect-square overflow-hidden bg-[var(--color-surface)]">
                            <img src={item.reel.thumbnail}  alt={`Post ${item.reel.name}`} className="h-full w-full object-cover" />
                            <div className="absolute right-2 top-2 h-4 w-4 rounded-[4px] border-2 border-white/95" />
                        </div>
                    ))}
                </section>
            </div>
        </div>
    )
}

export default UserProfile
