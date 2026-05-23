import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
    Briefcase,
    Check,
    Mail,
    PencilLine,
    Phone,
    Text,
    TrendingUp,
    Users,
    Video,
    X,
} from 'lucide-react'

const PROFILE_TASKS = [
    { key: 'name', label: 'Business name', weight: 15 },
    { key: 'email', label: 'Email address', weight: 10 },
    { key: 'phone', label: 'Phone number', weight: 10 },
    { key: 'address', label: 'Location', weight: 20 },
    { key: 'bio', label: 'Biography', weight: 15 },
    { key: 'profile_picture', label: 'Profile photo', weight: 10 },
    { key: 'followersCount', label: 'Meals listed', weight: 10 },
    { key: 'customerServed', label: 'Customer reach', weight: 10 },
]

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--color-text-primary)]">
                {value || 'Not added yet'}
            </p>
        </div>
    )
}

function CompletionRing({ progress }) {
    const angle = Math.min(Math.max(progress, 0), 100) * 3.6

    return (
        <div
            className="relative grid h-36 w-36 place-items-center rounded-full"
            style={{
                background: `conic-gradient(var(--color-accent) 0deg ${angle}deg, var(--color-lightgray) ${angle}deg 360deg)`,
            }}
        >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--color-card)] text-center">
                <span className="text-3xl font-bold text-[var(--color-text-primary)]">{progress}%</span>
            </div>
        </div>
    )
}

function formatCompactNumber(value) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`
    }

    return `${value}`
}

function isTaskComplete(profile, key) {
    if (key === 'followersCount') {
        return Number(profile?.followersCount) > 0
    }

    return Boolean(profile?.[key])
}

export default function CreatorProfile() {
    const [profile, setProfile] = useState(null)
    const [reelCount, setReelCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/creator/profile`, { withCredentials: true })
            .then((response) => {
                const creator = response.data?.creator

                if (!creator) {
                    setError('Creator profile could not be loaded.')
                    setLoading(false)
                    return
                }

                setProfile(creator)
                setReelCount(Array.isArray(response.data?.reels) ? response.data.reels.length : 0)
                setLoading(false)
            })
            .catch((fetchError) => {
                console.error('Error fetching creator profile', fetchError)
                setError('Creator profile could not be loaded.')
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)]">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 text-center">
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-8 shadow-[var(--shadow-card)]">
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">
                        {error || 'Creator profile is not available right now.'}
                    </p>
                </div>
            </div>
        )
    }

    const completedWeight = PROFILE_TASKS.reduce((sum, task) => {
        return isTaskComplete(profile, task.key) ? sum + task.weight : sum
    }, 0)

    const completionData = {
        progress: Math.min(100, completedWeight),
        items: PROFILE_TASKS.map((task) => ({
            ...task,
            isComplete: isTaskComplete(profile, task.key),
        })),
    }

    const followersCount = Number(profile.followersCount) || 0
    const customerServed = Number(profile.customerServed) || 0
    const creatorName = profile.name || 'Your food brand'
    const creatorImage =
        profile.profile_picture ||
        'https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg'
    const profession = profile.Profession ?? profile.profession ?? ''
    const bio = profile.bio ?? ''

    const stats = [
        { label: 'Followers', value: followersCount, icon: Users },
        { label: 'Reach', value: formatCompactNumber(customerServed), icon: TrendingUp },
        { label: 'Posts', value: reelCount, icon: Video },
    ]

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text-primary)] md:px-6 md:py-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <main className="space-y-6">
                        <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-card)]">
                            <div className="relative px-6 py-8 md:px-8">
                                <div className="absolute inset-x-0 top-0 h-32 bg-[var(--gradient-hero)] opacity-[0.12]" />
                                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                        <div className="h-[88px] w-[88px] shrink-0 rounded-full bg-[var(--gradient-brand)] p-[3px]">
                                            <img
                                                src={creatorImage}
                                                alt={creatorName}
                                                className="h-full w-full rounded-full border-2 border-[var(--color-card)] object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 space-y-2">
                                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                                {creatorName}
                                            </h1>
                                            {profession ? (
                                                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                                                    {profession}
                                                </p>
                                            ) : null}
                                            {bio ? (
                                                <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                                    {bio}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-[var(--color-text-muted)]">
                                                    Add a bio so customers know your kitchen better.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/creator/profile/edit')}
                                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-text-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)] sm:self-center"
                                    >
                                        <PencilLine className="h-4 w-4" />
                                        Edit profile
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-4 sm:grid-cols-3">
                            {stats.map((item) => {
                                const Icon = item.icon

                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-5 shadow-[var(--shadow-xs)]"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                                            <Icon className="h-4 w-4 text-[var(--color-primary)]" />
                                            {item.label}
                                        </div>
                                        <p className="mt-2 text-3xl font-bold tracking-tight">
                                            {item.value}
                                        </p>
                                    </div>
                                )
                            })}
                        </section>

                        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)] md:p-6">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Personal info</h2>
                                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                    Details customers see on your public profile.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <ProfileField icon={Briefcase} label="Profession" value={profession} />
                                <ProfileField icon={Mail} label="Email" value={profile.email} />
                                <ProfileField icon={Phone} label="Phone" value={profile.phone} />
                               
                            </div>
                        </section>
                    </main>

                    <aside>
                        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-6 shadow-[var(--shadow-card)] md:px-6">
                            <h2 className="text-xl font-bold tracking-tight">Complete your profile</h2>
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                Finish these steps to build trust with new customers.
                            </p>
                            <div className="mt-6 flex items-center justify-center">
                                <CompletionRing progress={completionData.progress} />
                            </div>
                            <div className="mt-6 space-y-3">
                                {completionData.items.map((item) => (
                                    <div key={item.key} className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${item.isComplete
                                                    ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                                    : 'bg-[var(--color-lightgray)] text-[var(--color-text-muted)]'
                                                    }`}
                                            >
                                                {item.isComplete ? (
                                                    <Check className="h-3.5 w-3.5" />
                                                ) : (
                                                    <X className="h-3.5 w-3.5" />
                                                )}
                                            </div>
                                            <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                                                {item.label}
                                            </span>
                                        </div>
                                        <span
                                            className={`shrink-0 text-sm font-semibold ${item.isComplete
                                                ? 'text-[var(--color-success)]'
                                                : 'text-[var(--color-text-muted)]'
                                                }`}
                                        >
                                            {item.weight}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {completionData.progress < 100 ? (
                                <button
                                    type="button"
                                    onClick={() => navigate('/creator/profile/edit')}
                                    className="mt-6 h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)]"
                                >
                                    Complete profile
                                </button>
                            ) : null}
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    )
}
