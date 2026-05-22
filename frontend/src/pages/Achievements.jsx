import axios from 'axios'
import { useEffect, useState } from 'react'
import { Award, CheckCircle2, Crown, Lock, Medal, Sparkles, Trophy } from 'lucide-react'
import {
    BADGE_TIERS,
    TIER_LABELS,
    getBadgesByTier,
    normalizeBadge,
} from './achievements/badgeData'

const TIER_STYLES = {
    bronze: {
        icon: Medal,
        ring: 'border-[var(--color-border-strong)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary-dark)]',
        label: 'text-[var(--color-secondary-dark)]',
        section: 'border-[var(--color-border-strong)]',
    },
    silver: {
        icon: Award,
        ring: 'border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]',
        label: 'text-[var(--color-text-secondary)]',
        section: 'border-[var(--color-border)]',
    },
    gold: {
        icon: Trophy,
        ring: 'border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary-dark)]',
        label: 'text-[var(--color-secondary-dark)]',
        section: 'border-[var(--color-secondary)]/40',
    },
    platinum: {
        icon: Crown,
        ring: 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]',
        label: 'text-[var(--color-accent-dark)]',
        section: 'border-[var(--color-accent)]/35',
    },
}

function BadgeCard({ badge, onCompleteBadge, completingId }) {
    const tierStyle = TIER_STYLES[badge.tier]
    const TierIcon = tierStyle.icon
    const isCompleting = completingId === badge.id

    return (
        <article
            className={`rounded-[26px] border p-5 shadow-[var(--shadow-xs)] transition ${
                badge.completed
                    ? 'border-[var(--color-border)] bg-[var(--color-card)]'
                    : 'border-[var(--color-border-subtle)] bg-[var(--color-surface)] opacity-90'
            }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 ${tierStyle.ring}`}
                >
                    {badge.iconUrl ? (
                        <img
                            src={badge.iconUrl}
                            alt=""
                            className="h-8 w-8 rounded-lg object-cover"
                        />
                    ) : (
                        <TierIcon className="h-7 w-7" aria-hidden />
                    )}
                    {badge.completed ? (
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-text-on-primary)]">
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                        </span>
                    ) : (
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
                            <Lock className="h-3.5 w-3.5" aria-hidden />
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                            {badge.name}
                        </h3>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${tierStyle.label} bg-[var(--color-surface-raised)]`}
                        >
                            {TIER_LABELS[badge.tier]}
                        </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {badge.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[var(--color-primary)]">
                        +{badge.pointsBonus} bonus points
                    </p>
                    {!badge.completed && onCompleteBadge && (
                        <button
                            type="button"
                            onClick={() => onCompleteBadge(badge.id)}
                            disabled={isCompleting}
                            className="mt-3 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-3 py-1 text-[0.7rem] font-semibold text-[var(--color-primary)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCompleting ? 'Saving...' : 'Mark complete'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    )
}

function TierSection({ tier, badges, onCompleteBadge, completingId }) {
    if (!badges.length) return null

    const tierStyle = TIER_STYLES[tier]
    const TierIcon = tierStyle.icon
    const completedInTier = badges.filter((b) => b.completed).length

    return (
        <section className={`rounded-[32px] border bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)] md:p-6 ${tierStyle.section}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 ${tierStyle.ring}`}
                    >
                        <TierIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                            {TIER_LABELS[tier]}
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            {completedInTier} of {badges.length} unlocked
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {badges.map((badge) => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                        onCompleteBadge={onCompleteBadge}
                        completingId={completingId}
                    />
                ))}
            </div>
        </section>
    )
}

export default function Achievements() {
    const [badges, setBadges] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [completingId, setCompletingId] = useState('')

    async function handleCompleteBadge(badgeId) {
        setCompletingId(badgeId)

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/badge/${badgeId}/completeBadge`,
                {},
                { withCredentials: true }
            )

            setBadges((currentBadges) =>
                currentBadges.map((badge) =>
                    badge.id === badgeId ? { ...badge, completed: true } : badge
                )
            )
        } catch (error) {
            console.log('error completing badge', error)
        } finally {
            setCompletingId('')
        }
    }

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/badge`, { withCredentials: true })
            .then((response) => {
                const nextBadges = Array.isArray(response.data?.badges)
                    ? response.data.badges.map(normalizeBadge)
                    : []

                setBadges(nextBadges)
                setLoadError('')
            })
            .catch((error) => {
                console.log('error in fetching badges', error)
                setBadges([])
                setLoadError('Unable to load achievements right now.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const badgesByTier = getBadgesByTier(badges)
    const completedBadges = badges.filter((badge) => badge.completed)
    const totalPoints = completedBadges.reduce((sum, badge) => sum + badge.pointsBonus, 0)

    if (loading) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-bg)] px-6 md:h-[100vh]">
                <div className="w-full max-w-md">
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--color-primary)]" />
                    </div>
                    <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
                        Loading achievements...
                    </p>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-bg)] px-6 text-center md:h-[100vh]">
                <div className="max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
                    <p className="text-lg font-semibold">Achievements unavailable</p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{loadError}</p>
                </div>
            </div>
        )
    }

    if (!badges.length) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-bg)] px-6 text-center md:h-[100vh]">
                <div className="max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
                    <p className="text-lg font-semibold">No badges yet</p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        Badge data has not been added to the platform yet.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
                <header>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                            <Sparkles className="h-6 w-6" aria-hidden />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                Earn badges by exploring reels, stacks, and the community.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 shadow-[var(--shadow-xs)]">
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                Completed
                            </p>
                            <p className="mt-1 text-2xl font-bold">
                                {completedBadges.length}
                                <span className="text-base font-medium text-[var(--color-text-secondary)]">
                                    /{badges.length}
                                </span>
                            </p>
                        </div>
                        <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 shadow-[var(--shadow-xs)]">
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                Bonus points
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[var(--color-primary)]">
                                +{totalPoints}
                            </p>
                        </div>
                        <div className="col-span-2 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 shadow-[var(--shadow-xs)] sm:col-span-1">
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                Next tier
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                                {completedBadges.length < badges.length
                                    ? 'Keep unlocking badges'
                                    : 'All badges unlocked'}
                            </p>
                        </div>
                    </div>
                </header>

                {completedBadges.length > 0 && (
                    <section className="mt-10">
                        <div className="mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
                            <h2 className="text-lg font-bold tracking-tight">Completed badges</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {completedBadges.map((badge) => (
                                <BadgeCard
                                    key={`completed-${badge.id}`}
                                    badge={badge}
                                    onCompleteBadge={handleCompleteBadge}
                                    completingId={completingId}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 space-y-8">
                    {BADGE_TIERS.map((tier) => (
                        <TierSection
                            key={tier}
                            tier={tier}
                            badges={badgesByTier[tier]}
                            onCompleteBadge={handleCompleteBadge}
                            completingId={completingId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
