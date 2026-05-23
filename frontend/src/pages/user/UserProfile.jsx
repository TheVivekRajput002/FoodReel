import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Award, Crown, Flame, Medal, Settings, Trophy, Bookmark, Heart, Play, X, Diff } from 'lucide-react'
import { normalizeBadge } from '../achievements/badgeData'

const TIER_ICONS = {
    bronze: Medal,
    silver: Award,
    gold: Trophy,
    platinum: Crown,
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
            <p className="text-[15px] font-medium text-[var(--color-text-muted)]">Coming Soon</p>
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
    const [showCreatorPrompt, setShowCreatorPrompt] = useState(false)
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

    const handleBecomeCreator = async () => {
        setShowCreatorPrompt(false)
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/logout`, { withCredentials: true })
            localStorage.removeItem('scs_auth')
            navigate('/creator/register', { replace: true })
        } catch (errorLogMsg) {
            console.error('Logout failed', errorLogMsg)
            navigate('/creator/register', { replace: true })
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
    const followingCount = user.followingCount || 0
    const score = user.score || 0
    const streak = Number(user.streak) || 0
    const profileImage = user.profile_picture || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    const bio = user.bio || "new user"
    const insightsCta = 'View Insights'
    const completedBadges = badges.filter((badge) => badge.completed)

    return (
        <div className="min-h-[100dvh] w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-[935px] pb-24 md:px-10 md:pb-10">
                {/*=========== phone view header =========== */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 md:static md:h-auto md:border-b-0 md:px-0 md:pt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/user/profile/edit')}
                        className="flex h-8 w-8 items-center justify-center text-[var(--color-text-primary)] md:hidden"
                        aria-label="Settings"
                    >
                        <Settings />
                    </button>

                    <div className="flex items-center gap-1.5 md:hidden">
                        <h1 className="text-[16px] font-semibold leading-6 tracking-[-0.01em] md:text-[16px]">{username}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                        </svg>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreatorPrompt(true)}
                        className="flex h-8 w-8 items-center justify-center text-[var(--color-text-primary)] md:hidden"
                        aria-label="Become a creator"
                    >
                        <Diff />
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
                                Touch grass
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
                                   
                                    <StatItem value="0" label="aura" />
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
                                Touch grass
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
                                <p className="text-base"><span className="font-semibold">0</span> aura</p>
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

                {/* ======================= profile content tabs section ======================= */}
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

            {showCreatorPrompt ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
                    onClick={() => setShowCreatorPrompt(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="creator-prompt-title"
                    >
                        <h2 id="creator-prompt-title" className="text-center text-lg font-semibold text-[var(--color-text-primary)]">
                            Do you want to become a creator?
                        </h2>
                        <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
                            You will be signed out and can register as a creator.
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCreatorPrompt(false)}
                                className="h-11 rounded-xl bg-[var(--color-surface)] text-[15px] font-semibold text-[var(--color-text-primary)]"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={handleBecomeCreator}
                                className="h-11 rounded-xl bg-[var(--color-primary)] text-[15px] font-semibold text-[var(--color-text-on-primary)]"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

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
