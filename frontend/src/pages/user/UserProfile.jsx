import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function UserProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
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
            <div className="h-[100dvh] w-full bg-[var(--color-bg)] flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="h-[100dvh] w-full bg-[var(--color-bg)] flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-base font-medium">You are not logged in</p>
                    <button
                        onClick={() => navigate('/user/login')}
                        className="mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] text-sm font-semibold py-2.5 px-8 rounded-full transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        )
    }

    const highlights = [
        { id: 1, title: 'IIT Kanpurrr' },
        { id: 2, title: 'huhhh?' },
        { id: 3, title: 'Me*' },
        { id: 4, title: 'November' },
    ]

    return (
        <div className="min-h-[100dvh] w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-[980px] px-8 pb-24 pt-8 md:px-8 md:pb-10 md:pt-12">
                <section className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="mx-auto md:mx-0 md:w-[34%] flex justify-center">
                        <div className="h-28 w-28 md:h-40 md:w-40 rounded-full bg-[var(--gradient-brand)] p-[3px]">
                            <div className="h-full w-full rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-on-primary)] text-4xl md:text-6xl font-bold">
                                {user.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-[46%]">

                        <h1 className="text-lg md:text-[2rem] font-bold tracking-tight">{user.name || 'username'}</h1>
                        <p className=" text-sm font-medium">{user.username}</p>

                        <div className="mt-4 flex items-center gap-6 text-lg">
                            <p><span className="font-semibold">14</span> posts</p>
                            <p><span className="font-semibold">547</span> followers</p>
                            <p><span className="font-semibold">751</span> following</p>
                        </div>

                        <p className="mt-5 text-[var(--color-text-secondary)]">{user.email}</p>
                    </div>
                </section>

                <section className="mt-7 grid grid-cols-2 gap-2 md:gap-3">
                    <button
                        onClick={() => navigate('/user/profile/edit')}
                        className="h-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors"
                    >
                        Edit Profile
                    </button>
                    <button className="h-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors">
                        View archive
                    </button>
                </section>

                <section className="mt-8 flex gap-5 overflow-x-auto pb-2">
                    {highlights.map((item) => (
                        <div key={item.id} className="shrink-0 text-center">
                            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-[var(--color-border)] p-1.5">
                                <div className="h-full w-full rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]" />
                            </div>
                            <p className="mt-2 text-sm font-semibold">{item.title}</p>
                        </div>
                    ))}
                    <div className="shrink-0 text-center">
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-[var(--color-border)] p-1.5 flex items-center justify-center bg-[var(--color-surface)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                            </svg>
                        </div>
                        <p className="mt-2 text-sm font-semibold">New</p>
                    </div>
                </section>

                <section className="mt-8 border-y border-[var(--color-border)]">
                    <div className="grid grid-cols-4">
                        <button className="h-14 flex items-center justify-center border-t-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h6.5v6.5h-6.5zm0 10h6.5v6.5h-6.5zm10-10h6.5v6.5h-6.5zm0 10h6.5v6.5h-6.5z" />
                            </svg>
                        </button>
                        <button className="h-14 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />
                            </svg>
                        </button>
                        <button className="h-14 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 4l-6 6M4 20l6-6" />
                            </svg>
                        </button>
                        <button className="h-14 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5h.008v.008H16.5V7.5zm-9 0h.008v.008H7.5V7.5zm9 9h.008v.008H16.5V16.5zm-9 0h.008v.008H7.5V16.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5A3.75 3.75 0 017.5 3.75h9A3.75 3.75 0 0120.25 7.5v9a3.75 3.75 0 01-3.75 3.75h-9a3.75 3.75 0 01-3.75-3.75v-9z" />
                            </svg>
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-3 gap-1 mt-1">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="aspect-square bg-[var(--color-surface)] relative">
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-sm border-2 border-[var(--color-text-on-primary)] bg-[var(--color-text-on-primary)]/10" />
                        </div>
                    ))}
                </section>

                <button
                    onClick={handleLogout}
                    className="mt-7 w-full md:w-auto px-8 h-11 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-danger)] font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-[var(--color-error-soft)]"
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
