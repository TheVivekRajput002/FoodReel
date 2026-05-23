import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpenText, ChevronLeft, Grid3X3, Play, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { showUnlockedBadges } from '../../utils/badgeToasts'
import { toggleFollowCreator } from '../../utils/creatorFollow'

function formatCount(value) {
    const count = Number(value) || 0

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1)}M`
    }

    if (count >= 1000) {
        return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
    }

    return `${count}`
}

const CREATOR_TABS = {
    reels: 'reels',
    stacks: 'stacks',
}

const CREATOR_TAB_ITEMS = [
    { id: CREATOR_TABS.reels, icon: Grid3X3, label: 'Reels' },
    { id: CREATOR_TABS.stacks, icon: BookOpenText, label: 'Stacks' },
]

function StatItem({ value, label }) {
    return (
        <div className="min-w-[72px] text-center">
            <p className="text-[20px] font-semibold leading-6 text-[var(--color-text-primary)]">{value}</p>
            <p className="mt-0.5 text-[16px] leading-5 text-[var(--color-text-primary)]">{label}</p>
        </div>
    )
}

function CreatorTabButton({ tab, activeTab, onSelect }) {
    const Icon = tab.icon
    const isActive = activeTab === tab.id

    return (
        <button
            type="button"
            onClick={() => onSelect(tab.id)}
            aria-label={tab.label}
            aria-selected={isActive}
            className={`flex h-11 flex-1 items-center justify-center border-t md:h-12 ${isActive
                ? 'border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-muted)]'
                }`}
        >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
        </button>
    )
}

export default function CreatorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [creator, setCreator] = useState(null)
    const [reels, setReels] = useState([])
    const [stacks, setStacks] = useState([])
    const [activeTab, setActiveTab] = useState(CREATOR_TABS.reels)
    const [isFollowed, setIsFollowed] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [followLoading, setFollowLoading] = useState(false)
    const [selectedReel, setSelectedReel] = useState(null)

    useEffect(() => {
        if (!id) {
            setError('Creator not found.')
            setLoading(false)
            return
        }

        setLoading(true)
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/creator/${id}`, { withCredentials: true })
            .then((response) => {
                const profile = response.data?.creator

                if (!profile) {
                    setError('Creator profile could not be loaded.')
                    return
                }

                setCreator(profile)
                setReels(Array.isArray(response.data?.reels) ? response.data.reels : [])
                setStacks(Array.isArray(response.data?.stacks) ? response.data.stacks : [])
                setIsFollowed(!!response.data?.isFollowed)
                setError('')
            })
            .catch((fetchError) => {
                console.error('Error fetching creator profile', fetchError)
                setError('Creator profile could not be loaded.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id])

    useEffect(() => {
        if (!selectedReel) {
            return undefined
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedReel(null)
            }
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedReel])

    const handleFollow = async () => {
        if (!id || followLoading) {
            return
        }

        const previousFollowed = isFollowed
        setFollowLoading(true)
        setIsFollowed(!previousFollowed)

        try {
            const { isFollowed: nextFollowed, unlockedBadges } = await toggleFollowCreator(id)
            setIsFollowed(nextFollowed)
            setCreator((prev) => {
                if (!prev) {
                    return prev
                }

                const delta = nextFollowed === previousFollowed ? 0 : nextFollowed ? 1 : -1

                return {
                    ...prev,
                    followersCount: Math.max(0, (Number(prev.followersCount) || 0) + delta),
                }
            })
            showUnlockedBadges(unlockedBadges, showToast)
        } catch (followError) {
            setIsFollowed(previousFollowed)
            console.error('Follow request failed:', followError)
        } finally {
            setFollowLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        )
    }

    if (!creator) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 text-center">
                <div>
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {error || 'Creator not found.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)]"
                    >
                        Go back
                    </button>
                </div>
            </div>
        )
    }

    const creatorName = creator.name || 'Creator'
    const profileImage =
        creator.profile_picture ||
        'https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg'
    const followersCount = Number(creator.followersCount) || 0
    const postCount = reels.length
    const stackCount = stacks.length

    return (
        <div className="min-h-[100dvh] w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-[935px] pb-24 md:px-10 md:pb-10">
                <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 md:static md:h-auto md:border-b-0 md:px-0 md:pt-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex h-8 w-8 items-center justify-center text-[var(--color-text-primary)]"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="truncate text-[16px] font-semibold leading-6 tracking-[-0.01em] md:text-[28px] md:font-normal md:leading-8">
                        {creatorName}
                    </h1>
                </header>

                <div className="px-4 pt-4 md:px-0 md:pt-10">
                    <section className="md:hidden">
                        <div className="grid grid-cols-[96px_1fr] items-center gap-x-4">
                            <div className="flex justify-start">
                                <div className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                    <img
                                        src={profileImage}
                                        alt={creatorName}
                                        className="block h-full w-full object-cover object-center"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <StatItem value={postCount} label="posts" />
                                <StatItem value={formatCount(followersCount)} label="followers" />
                                <StatItem value={stackCount} label="stacks" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-[16px] font-semibold leading-5">{creatorName}</p>
                            {creator.email ? (
                                <p className="mt-1 text-[14px] leading-5 text-[var(--color-text-secondary)]">
                                    {creator.email}
                                </p>
                            ) : null}
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`h-10 w-full rounded-xl px-4 text-[17px] font-semibold transition-colors ${isFollowed
                                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
                                    : 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]'
                                    } disabled:opacity-60`}
                            >
                                {followLoading ? '...' : isFollowed ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </section>

                    <section className="hidden md:grid md:grid-cols-[291px_1fr] md:gap-x-24">
                        <div className="flex justify-center">
                            <div className="h-[150px] w-[150px] overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                                <img
                                    src={profileImage}
                                    alt={creatorName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-[28px] font-normal leading-8">{creatorName}</h2>
                                <button
                                    type="button"
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`h-8 rounded-lg px-4 text-sm font-semibold transition-colors ${isFollowed
                                        ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
                                        : 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]'
                                        } disabled:opacity-60`}
                                >
                                    {followLoading ? '...' : isFollowed ? 'Following' : 'Follow'}
                                </button>
                            </div>

                            <div className="mt-5 flex items-center gap-10">
                                <p className="text-base">
                                    <span className="font-semibold">{postCount}</span> posts
                                </p>
                                <p className="text-base">
                                    <span className="font-semibold">{formatCount(followersCount)}</span> followers
                                </p>
                                <p className="text-base">
                                    <span className="font-semibold">{stackCount}</span> stacks
                                </p>
                            </div>

                            <div className="mt-7">
                                <p className="text-sm font-semibold">{creatorName}</p>
                                {creator.email ? (
                                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{creator.email}</p>
                                ) : null}
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-5 border-t border-[var(--color-border)]">
                    <div className="grid grid-cols-2 border-b border-[var(--color-border)]">
                        {CREATOR_TAB_ITEMS.map((tab) => (
                            <CreatorTabButton
                                key={tab.id}
                                tab={tab}
                                activeTab={activeTab}
                                onSelect={setActiveTab}
                            />
                        ))}
                    </div>

                    {activeTab === CREATOR_TABS.reels && (
                        reels.length > 0 ? (
                            <div className="grid grid-cols-3 gap-[1px] bg-[var(--color-bg)]">
                                {reels.map((reel) => (
                                    <button
                                        key={reel._id}
                                        type="button"
                                        onClick={() => setSelectedReel(reel)}
                                        disabled={!reel.video}
                                        className="group relative aspect-[9/16] overflow-hidden bg-[var(--color-surface)] disabled:cursor-not-allowed"
                                        aria-label={reel.name ? `Play ${reel.name}` : 'Play reel'}
                                    >
                                        <img
                                            src={reel.thumbnail || profileImage}
                                            alt={reel.name || 'Creator reel'}
                                            className="h-full w-full object-cover transition duration-200 group-hover:opacity-90 group-disabled:opacity-60"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-40">
                                            <Play className="h-8 w-8 fill-white text-white drop-shadow-md" aria-hidden />
                                        </div>
                                        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 text-xs font-semibold text-white drop-shadow-md">
                                            <Play className="h-3 w-3 fill-white" aria-hidden />
                                            {formatCount(reel.likeCount)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[280px] items-center justify-center px-6 py-16">
                                <p className="text-[15px] font-medium text-[var(--color-text-muted)]">No posts yet</p>
                            </div>
                        )
                    )}

                    {activeTab === CREATOR_TABS.stacks && (
                        stacks.length > 0 ? (
                            <div className="grid grid-cols-2 justify-items-center gap-5 px-4 py-6 sm:grid-cols-3 sm:gap-6 md:px-0">
                                {stacks.map((stack) => (
                                    <button
                                        key={stack._id}
                                        type="button"
                                        onClick={() => navigate(`/stack/${stack._id}`)}
                                        className="group flex w-full max-w-[13.5rem] flex-col items-center gap-2 text-left transition hover:-translate-y-0.5"
                                        aria-label={stack.title ? `Open ${stack.title}` : 'Open stack'}
                                    >
                                        <div className="relative aspect-[13.5/19] w-full overflow-hidden rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-lg)] transition group-hover:shadow-[var(--shadow-card)]">
                                            <div className="absolute inset-y-0 left-0 z-10 w-3 bg-[var(--color-text-primary)]/75" />
                                            <img
                                                src={stack.coverImage || profileImage}
                                                alt={stack.title ? `${stack.title} cover` : 'Creator stack cover'}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                            />
                                        </div>
                                        <p className="line-clamp-2 w-full px-0.5 text-center text-xs font-semibold leading-snug text-[var(--color-text-primary)]">
                                            {stack.title || 'Stack'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[280px] items-center justify-center px-6 py-16">
                                <p className="text-[15px] font-medium text-[var(--color-text-muted)]">No stacks yet</p>
                            </div>
                        )
                    )}
                </section>
            </div>

            {selectedReel ? (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
                    onClick={() => setSelectedReel(null)}
                >
                    <div
                        className="relative flex max-h-[min(100dvh,920px)] w-full max-w-sm flex-col overflow-hidden rounded-t-[24px] border border-white/10 bg-black shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-[32px]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedReel(null)}
                            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                            aria-label="Close reel preview"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <video
                                key={selectedReel._id}
                                src={selectedReel.video}
                                poster={selectedReel.thumbnail}
                                className="aspect-[9/16] w-full bg-black object-cover"
                                controls
                                autoPlay
                                playsInline
                            />

                            <div className="space-y-2 bg-[var(--color-card)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-4">
                                <p className="pr-10 text-base font-semibold text-[var(--color-text-primary)]">
                                    {selectedReel.name || 'Reel'}
                                </p>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {selectedReel.description || 'No description.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
