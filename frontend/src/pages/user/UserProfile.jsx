import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Award, Crown, Flame, Medal, Settings, Trophy, Bookmark, Heart, Play, X } from 'lucide-react'
import { normalizeBadge } from '../achievements/badgeData'

const TIER_ICONS = {
    bronze: Medal,
    silver: Award,
    gold: Trophy,
    platinum: Crown,
}

const PROFILE_STATS = {
    aura: 0,
    followers: 547,
    following: 404,
}

const PROFILE_TABS = {
    saved: 'saved',
    liked: 'liked',
    achievements: 'achievements',
}

const PROFILE_TAB_ITEMS = [
    { id: PROFILE_TABS.saved, icon: Bookmark, label: 'Saved reels' },
    { id: PROFILE_TABS.liked, icon: Heart, label: 'Liked reels' },
    { id: PROFILE_TABS.achievements, icon: Trophy, label: 'Achievements' },
]

function ProfileTabButton({ tab, activeTab, onSelect }) {
    const Icon = tab.icon
    const isActive = activeTab === tab.id

    return (
        <button
            type="button"
            onClick={() => onSelect(tab.id)}
            aria-label={tab.label}
            aria-selected={isActive}
            className={`flex h-11 items-center justify-center border-t md:h-12 ${isActive
                    ? 'border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                    : 'border-transparent text-[var(--color-text-muted)]'
                }`}
        >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
        </button>
    )
}

function ProfileEmptyState() {
    return (
        <div className="flex min-h-[280px] items-center justify-center px-6 py-16">
            <p className="text-[15px] font-medium text-[var(--color-text-muted)]">empty</p>
        </div>
    )
}

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
    const [savedReels, setSavedReels] = useState([])
    const [activeTab, setActiveTab] = useState(PROFILE_TABS.saved)
    const [selectedReel, setSelectedReel] = useState(null)
    const [badges, setBadges] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/profile`, { withCredentials: true })
            .then(response => {
                const profile = response.data?.user

                if (!profile) {
                    setError('Profile data could not be loaded.')
                    setLoading(false)
                    return
                }

                setUser(profile)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                navigate('/user/login', { replace: true })
            })
    }, [navigate])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/reel/savedReels`, { withCredentials: true })
            .then(response => {
                setSavedReels(Array.isArray(response.data?.savedReels) ? response.data.savedReels : [])
            })
            .catch((errorLogMsg) => {
                console.error('Saved reels could not be loaded', errorLogMsg)
                setSavedReels([])
            })
    }, [navigate])

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/badge`, { withCredentials: true })
            .then((response) => {
                const nextBadges = Array.isArray(response.data?.badges)
                    ? response.data.badges.map(normalizeBadge)
                    : []
                setBadges(nextBadges)
            })
            .catch((errorLogMsg) => {
                console.error('Badges could not be loaded', errorLogMsg)
                setBadges([])
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
            <div className="flex h-[100dvh] w-full flex-col bg-[var(--color-bg)]">
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 text-center text-[var(--color-text-primary)]">
                <div>
                    <p className="text-lg font-semibold">{error || 'Profile not available right now.'}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/user/login', { replace: true })}
                        className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)]"
                    >
                        Go to login
                    </button>
                </div>
            </div>
        )
    }

    const profileName = user.name || 'Vivek Rajput'
    const username = user.username || 'tvr002'
    const followingCount = user.followingCount || '404'
    const score = user.score || '404'
    const streak = Number(user.streak) || 0
    const profileImage = user.profile_picture || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    const bio = user.bio || "new user"
    const insightsCta = 'View Insights'
    const completedBadges = badges.filter((badge) => badge.completed)

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
                        {/* ==================== phone view  =================== */}
                        {/* ==================== profile top section  =================== */}
                        <div className="grid grid-cols-[96px_1fr] items-center gap-x-4">
                            <div className="flex justify-start">
                                <div className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                    <img src={profileImage} alt={profileName} className="block h-full w-full object-cover object-center" />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <StatItem value={PROFILE_STATS.aura} label="aura" />
                                    <StatItem value={score} label="score" />
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


                    </section>

                    {/*====================== Laptop view ========================== */}
                    {/* ==================== profile top section  =================== */}

                    <section className="hidden md:grid md:grid-cols-[291px_1fr] md:gap-x-24">
                        <div className="flex justify-center">
                            <div className="h-[150px] w-[150px] overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                <img src={profileImage} alt={profileName} className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <div>
                            <div className="mt-3 flex items-center gap-10">
                                <p className="text-base"><span className="font-semibold">{PROFILE_STATS.aura}</span> aura</p>
                                <p className="text-base"><span className="font-semibold">{score}</span> score</p>
                                <p className="text-base"><span className="font-semibold">{user.followingCount}</span> following</p>
                            </div>
                            <div className="mt-7">
                                <p className="text-sm font-semibold">{profileName}</p>
                                <p className="mt-1 text-sm text-[var(--color-text-primary)]">{bio}</p>
                                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{user.email}</p>
                            </div>

                        </div>
                    </section>

                    {/* ======================= badges story section ==================== */}

                    <section className="mt-6 flex gap-4 overflow-x-auto pb-4 md:mt-11 md:gap-6">
                        <div className="w-[72px] shrink-0 text-center md:w-[84px]">
                            <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border-strong)] p-[3px] md:h-[84px] md:w-[84px]">
                                <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                    <Flame className="h-7 w-7 text-[var(--color-primary)] md:h-8 md:w-8" aria-hidden />
                                    <span className="mt-0.5 text-[15px] font-semibold leading-4 text-[var(--color-text-primary)] md:text-[17px]">
                                        {streak}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-1.5 truncate text-[12px] font-medium leading-4 text-[var(--color-text-primary)]">
                                Consistency
                            </p>
                        </div>

                        {completedBadges.map((badge) => {
                            const TierIcon = TIER_ICONS[badge.tier] || Medal

                            return (
                                <div key={badge.id} className="w-[72px] shrink-0 text-center md:w-[84px]">
                                    <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border-strong)] p-[3px] md:h-[84px] md:w-[84px]">
                                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                            {badge.iconUrl ? (
                                                <img
                                                    src={badge.iconUrl}
                                                    alt={badge.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <TierIcon className="h-8 w-8 text-[var(--color-text-secondary)] md:h-9 md:w-9" aria-hidden />
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-1.5 truncate text-[12px] font-medium leading-4 text-[var(--color-text-primary)]">
                                        {badge.name}
                                    </p>
                                </div>
                            )
                        })}
                    </section>
                </div>

                {/* ======================= profile content tabs ======================= */}
                <section className="mt-5 border-t border-[var(--color-border)]">
                    <div className="grid grid-cols-3">
                        {PROFILE_TAB_ITEMS.map((tab) => (
                            <ProfileTabButton
                                key={tab.id}
                                tab={tab}
                                activeTab={activeTab}
                                onSelect={setActiveTab}
                            />
                        ))}
                    </div>

                    {activeTab === PROFILE_TABS.saved && (
                        <div className="grid grid-cols-3 gap-[1px] bg-[var(--color-border)]">
                            {savedReels.map((item) => (
                                <button
                                    key={item._id}
                                    type="button"
                                    onClick={() => item.reel && setSelectedReel(item.reel)}
                                    disabled={!item.reel?.video}
                                    className="group relative aspect-[9/16] overflow-hidden bg-[var(--color-surface)] disabled:cursor-not-allowed"
                                    aria-label={item.reel?.name ? `Play ${item.reel.name}` : 'Play saved reel'}
                                >
                                    <img
                                        src={item.reel?.thumbnail || profileImage}
                                        alt={item.reel?.name || 'saved reel'}
                                        className="h-full w-full object-cover transition duration-200 group-hover:opacity-90 group-disabled:opacity-60"
                                    />
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-40">
                                        <Play className="h-8 w-8 fill-white text-white drop-shadow-md" aria-hidden />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === PROFILE_TABS.liked && <ProfileEmptyState />}
                    {activeTab === PROFILE_TABS.achievements && <ProfileEmptyState />}
                </section>
            </div>

            {selectedReel ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
                    onClick={() => setSelectedReel(null)}
                >
                    <div
                        className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedReel(null)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
                            aria-label="Close reel"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <video
                            key={selectedReel._id}
                            src={selectedReel.video}
                            poster={selectedReel.thumbnail}
                            className="aspect-[9/16] w-full bg-black object-cover"
                            controls
                            autoPlay
                            playsInline
                        />

                        <div className="space-y-1 bg-[var(--color-card)] px-5 py-4">
                            <p className="text-base font-semibold text-[var(--color-text-primary)]">
                                {selectedReel.name || 'Saved reel'}
                            </p>
                            {selectedReel.description ? (
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {selectedReel.description}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default UserProfile
