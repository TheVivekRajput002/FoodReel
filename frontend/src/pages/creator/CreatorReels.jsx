import { useEffect, useState } from 'react'
import axios from 'axios'
import { Eye, Film, Heart, MessageCircle, Play, X } from 'lucide-react'

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

export default function CreatorReels() {
    const [reels, setReels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedReel, setSelectedReel] = useState(null)

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/creator/profile`, { withCredentials: true })
            .then((response) => {
                setReels(Array.isArray(response.data?.reels) ? response.data.reels : [])
                setLoading(false)
            })
            .catch((fetchError) => {
                console.error('Error fetching creator reels', fetchError)
                setError('Creator reels could not be loaded.')
                setLoading(false)
            })
    }, [])

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

    if (loading) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)]">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)] px-6 text-center">
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-8 shadow-[var(--shadow-card)]">
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] px-3 py-4 pb-6 text-[var(--color-text-primary)] sm:px-4 sm:py-6 md:px-6 md:py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                            <Film className="h-4 w-4 text-[var(--color-primary)]" />
                            Creator Reels
                        </div>
                        <h1 className="mt-3 text-xl font-bold tracking-tight sm:mt-4 sm:text-2xl md:text-3xl">
                            All uploaded reels
                        </h1>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Review every reel you have published and open any one in a player window.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 shadow-[var(--shadow-xs)] sm:block sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                            Total reels
                        </p>
                        <p className="text-2xl font-bold text-[var(--color-text-primary)] sm:mt-1">
                            {reels.length}
                        </p>
                    </div>
                </div>

                {reels.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {reels.map((reel) => (
                            <button
                                key={reel._id}
                                type="button"
                                onClick={() => setSelectedReel(reel)}
                                className="group w-full overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 sm:rounded-[28px]"
                            >
                                <div className="relative aspect-[9/16] overflow-hidden bg-[var(--color-surface)]">
                                    <img
                                        src={reel.thumbnail || 'https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg'}
                                        alt={reel.name || 'Creator reel'}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                                    <div className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:h-11 sm:w-11">
                                        <Play className="h-3.5 w-3.5 fill-white text-white sm:h-4 sm:w-4" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 px-2.5 py-2.5 text-white sm:px-4 sm:py-4">
                                        <p className="line-clamp-1 text-sm font-semibold sm:text-base">
                                            {reel.name || 'Untitled reel'}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-xs text-white/80 sm:mt-1 sm:line-clamp-2 sm:text-sm">
                                            {reel.description || 'No description added yet.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-2 py-2.5 sm:space-y-4 sm:px-4 sm:py-4">
                                    <div className="grid grid-cols-3 gap-1.5 text-sm text-[var(--color-text-secondary)] sm:gap-3">
                                        <div className="flex flex-col items-center gap-1 rounded-xl bg-[var(--color-surface-raised)] px-1 py-2 sm:flex-row sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3">
                                            <Heart className="h-3.5 w-3.5 text-[var(--color-like)] sm:h-4 sm:w-4" />
                                            <p className="text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm">
                                                {formatCount(reel.likeCount)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 rounded-xl bg-[var(--color-surface-raised)] px-1 py-2 sm:flex-row sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3">
                                            <MessageCircle className="h-3.5 w-3.5 text-[var(--color-primary)] sm:h-4 sm:w-4" />
                                            <p className="text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm">
                                                {formatCount(reel.comments)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 rounded-xl bg-[var(--color-surface-raised)] px-1 py-2 sm:flex-row sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3">
                                            <Eye className="h-3.5 w-3.5 text-[var(--color-accent)] sm:h-4 sm:w-4" />
                                            <p className="text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm">
                                                {formatCount(reel.views)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 rounded-[20px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-4 py-10 text-center sm:mt-6 sm:rounded-[28px] sm:px-5 sm:py-12">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            No reels yet
                        </p>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Your uploaded reels will appear here once you publish them.
                        </p>
                    </div>
                )}
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
                                    {selectedReel.name || 'Creator reel'}
                                </p>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {selectedReel.description || 'Fresh from your reel library.'}
                                </p>
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="rounded-xl bg-[var(--color-surface-raised)] px-2 py-2 sm:rounded-2xl sm:px-3">
                                        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] sm:text-[11px]">
                                            Likes
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                                            {formatCount(selectedReel.likeCount)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[var(--color-surface-raised)] px-2 py-2 sm:rounded-2xl sm:px-3">
                                        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] sm:text-[11px]">
                                            Comments
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                                            {formatCount(selectedReel.comments)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[var(--color-surface-raised)] px-2 py-2 sm:rounded-2xl sm:px-3">
                                        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] sm:text-[11px]">
                                            Views
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                                            {formatCount(selectedReel.views)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
