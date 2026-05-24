import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { showUnlockedBadges } from '../utils/badgeToasts'
import {
    buildInitialFollowState,
    toggleFollowCreator,
} from '../utils/creatorFollow'
import {
    buildInitialLikedState,
    toggleLikedReel,
    updateLikedVideoState,
    writeLikedReels,
} from '../utils/reelLike'
import {
    buildInitialSavedState,
    toggleSavedReel,
    updateSavedVideoState,
    writeSavedReels,
} from '../utils/reelSave'

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

const REEL_PAGE_LIMIT = 10

function mergeUniqueReels(existing, incoming) {
    const seen = new Set(existing.map((reel) => String(reel._id)))

    return [
        ...existing,
        ...incoming.filter((reel) => {
            const id = String(reel._id)

            if (!id || seen.has(id)) {
                return false
            }

            seen.add(id)
            return true
        }),
    ]
}

function HomeReels() {
    const { showToast } = useToast()
    const [videos, setVideos] = useState([])
    const [liked, setLiked] = useState({})
    const [saved, setSaved] = useState({})
    const [isFollowing, setIsFollowing] = useState({})
    const [mutedReels, setMutedReels] = useState({})
    const [pausedReels, setPausedReels] = useState({})
    const [activeReelId, setActiveReelId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [loadError, setLoadError] = useState('')
    const [nextCursor, setNextCursor] = useState(null)
    const [hasMore, setHasMore] = useState(false)
    const reelRefs = useRef({})
    const videoRefs = useRef({})
    const progressBarRefs = useRef({})
    const progressRafRef = useRef(null)
    const scrollContainerRef = useRef(null)
    const loadMoreSentinelRef = useRef(null)
    const loadingMoreRef = useRef(false)
    const pendingActions = useRef(new Set())
    const watchedReelsReported = useRef(new Set())

    const setProgressBarWidth = (reelId, percent) => {
        const fill = progressBarRefs.current[String(reelId)]

        if (fill) {
            fill.style.width = `${percent}%`
        }
    }

    const WATCH_COMPLETE_THRESHOLD = 0.9

    const markReelWatched = (reelId) => {
        const id = String(reelId)
        if (!id || watchedReelsReported.current.has(id)) {
            return
        }

        watchedReelsReported.current.add(id)

        axios
            .post(
                `${import.meta.env.VITE_API_URL}/api/reel/${id}/watch`,
                {},
                { withCredentials: true }
            )
            .then((response) => {
                showUnlockedBadges(response.data?.unlockedBadges, showToast)
            })
            .catch((error) => {
                watchedReelsReported.current.delete(id)
                console.log('reel watch tracking skipped', error)
            })
    }

    const handleVideoTimeUpdate = (reelId, event) => {
        const reelKey = String(reelId)
        const video = event.currentTarget
        const { currentTime, duration } = video

        if (!duration || !Number.isFinite(duration)) {
            return
        }

        if (reelKey !== String(activeReelId)) {
            return
        }

        if (currentTime / duration < WATCH_COMPLETE_THRESHOLD) {
            return
        }

        markReelWatched(reelId)
    }

    const applyReelBatch = useCallback((reels, { append = false } = {}) => {
        if (!append) {
            setActiveReelId(reels[0]?._id ? String(reels[0]._id) : null)
        }

        setVideos((prev) => (append ? mergeUniqueReels(prev, reels) : reels))

        setIsFollowing((prev) => ({ ...prev, ...buildInitialFollowState(reels) }))
        setLiked((prev) => ({ ...prev, ...buildInitialLikedState(reels) }))
        setSaved((prev) => ({ ...prev, ...buildInitialSavedState(reels) }))
        setMutedReels((prev) => ({
            ...prev,
            ...reels.reduce((state, reel) => {
                if (reel?._id) {
                    state[reel._id] = prev[reel._id] ?? false
                }

                return state
            }, {}),
        }))
    }, [])

    const fetchReelPage = useCallback(async ({ cursor = null, append = false } = {}) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reel/`, {
            params: {
                limit: REEL_PAGE_LIMIT,
                ...(cursor ? { cursor } : {}),
            },
            withCredentials: true,
        })

        const reels = response.data.reel || []

        applyReelBatch(reels, { append })
        setNextCursor(response.data.nextCursor ?? null)
        setHasMore(!!response.data.hasMore)
        setLoadError('')

        return reels
    }, [applyReelBatch])

    const loadMoreReels = useCallback(async () => {
        if (!hasMore || !nextCursor || loadingMoreRef.current) {
            return
        }

        loadingMoreRef.current = true
        setLoadingMore(true)

        try {
            await fetchReelPage({ cursor: nextCursor, append: true })
        } catch (error) {
            console.error('Failed to load more reels:', error)
        } finally {
            loadingMoreRef.current = false
            setLoadingMore(false)
        }
    }, [fetchReelPage, hasMore, nextCursor])

    useEffect(() => {
        fetchReelPage()
            .catch((error) => {
                console.error('Failed to load reels:', error)
                setVideos([])
                setNextCursor(null)
                setHasMore(false)
                setLoadError('Unable to load reels. Check that the backend is running and VITE_API_URL is correct.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [fetchReelPage])

    useEffect(() => {
        if (loading || !hasMore || !nextCursor) {
            return undefined
        }

        const sentinel = loadMoreSentinelRef.current
        const root = scrollContainerRef.current

        if (!sentinel || !root) {
            return undefined
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    loadMoreReels()
                }
            },
            {
                root,
                rootMargin: '200px 0px',
                threshold: 0,
            }
        )

        observer.observe(sentinel)

        return () => observer.disconnect()
    }, [hasMore, loadMoreReels, loading, nextCursor, videos.length])

    useEffect(() => {
        if (!videos.length) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((firstEntry, secondEntry) => secondEntry.intersectionRatio - firstEntry.intersectionRatio)

                if (visibleEntries.length > 0) {
                    const nextActiveReelId = visibleEntries[0].target.dataset.reelId

                    if (nextActiveReelId) {
                        setActiveReelId(String(nextActiveReelId))
                    }
                }
            },
            {
                threshold: [0.35, 0.6, 0.8],
            }
        )

        Object.values(reelRefs.current).forEach((reelElement) => {
            if (reelElement) {
                observer.observe(reelElement)
            }
        })

        return () => observer.disconnect()
    }, [videos])

    useEffect(() => {
        const activeId = activeReelId ? String(activeReelId) : null

        if (!activeId || pausedReels[activeId]) {
            return undefined
        }

        const tick = () => {
            const video =
                videoRefs.current[activeReelId] ||
                videoRefs.current[activeId]
            const { currentTime, duration } = video || {}

            if (video && duration && Number.isFinite(duration)) {
                setProgressBarWidth(activeId, Math.min(100, (currentTime / duration) * 100))
            }

            progressRafRef.current = requestAnimationFrame(tick)
        }

        progressRafRef.current = requestAnimationFrame(tick)

        return () => {
            if (progressRafRef.current) {
                cancelAnimationFrame(progressRafRef.current)
                progressRafRef.current = null
            }
        }
    }, [activeReelId, pausedReels])

    useEffect(() => {
        const inactiveReelIds = []

        videos.forEach((reel) => {
            const videoElement = videoRefs.current[reel._id]

            if (!videoElement) {
                return
            }

            const reelId = String(reel._id)
            const isActiveReel = reelId === String(activeReelId)
            videoElement.muted = mutedReels[reel._id] === true

            if (isActiveReel) {
                if (pausedReels[reelId]) {
                    videoElement.pause()
                    return
                }

                const playPromise = videoElement.play()

                if (playPromise?.catch) {
                    playPromise.catch(() => {})
                }

                return
            }

            videoElement.pause()
            videoElement.currentTime = 0
            inactiveReelIds.push(reelId)
        })

        inactiveReelIds.forEach((reelId) => setProgressBarWidth(reelId, 0))
    }, [activeReelId, mutedReels, pausedReels, videos])

    useEffect(() => {
        const currentVideoRefs = videoRefs.current

        return () => {
            Object.values(currentVideoRefs).forEach((videoElement) => {
                videoElement?.pause()
            })
        }
    }, [])

    const handleFollow = async (creatorId) => {
        if (!creatorId) return

        const actionKey = `follow-${creatorId}`
        if (pendingActions.current.has(actionKey)) return

        const previousFollowed = !!isFollowing[creatorId]
        const optimisticFollowed = !previousFollowed

        pendingActions.current.add(actionKey)
        setIsFollowing((prev) => ({
            ...prev,
            [creatorId]: optimisticFollowed,
        }))

        try {
            const { isFollowed, unlockedBadges } = await toggleFollowCreator(creatorId)

            setIsFollowing((prev) => ({
                ...prev,
                [creatorId]: isFollowed,
            }))
            showUnlockedBadges(unlockedBadges, showToast)
        } catch (error) {
            setIsFollowing((prev) => ({
                ...prev,
                [creatorId]: previousFollowed,
            }))
            console.error("Follow request failed:", error)
        } finally {
            pendingActions.current.delete(actionKey)
        }
    }

    const handleLikeClick = async (reel) => {
        const reelId = reel._id
        const actionKey = `like-${reelId}`
        if (pendingActions.current.has(actionKey)) return

        const previousLiked = !!liked[reelId]
        const optimisticLiked = !previousLiked

        pendingActions.current.add(actionKey)
        setLiked((prev) => {
            const next = { ...prev, [reelId]: optimisticLiked }
            queueMicrotask(() => writeLikedReels(next))
            return next
        })
        setVideos((prev) => updateLikedVideoState(prev, reelId, optimisticLiked))

        try {
            const isLiked = await toggleLikedReel(reelId)

            if (isLiked !== optimisticLiked) {
                setVideos((prev) => updateLikedVideoState(prev, reelId, isLiked))
                setLiked((prev) => {
                    const next = { ...prev, [reelId]: isLiked }
                    queueMicrotask(() => writeLikedReels(next))
                    return next
                })
            }
        } catch (error) {
            setLiked((prev) => {
                const next = { ...prev, [reelId]: previousLiked }
                queueMicrotask(() => writeLikedReels(next))
                return next
            })
            setVideos((prev) => updateLikedVideoState(prev, reelId, previousLiked))
            console.error("Like request failed:", error)
        } finally {
            pendingActions.current.delete(actionKey)
        }
    }

    const handleSaveClick = async (reel) => {
        const reelId = reel._id
        const actionKey = `save-${reelId}`
        if (pendingActions.current.has(actionKey)) return

        const previousSaved = !!saved[reelId]
        const optimisticSaved = !previousSaved

        pendingActions.current.add(actionKey)
        setSaved((prev) => {
            const next = { ...prev, [reelId]: optimisticSaved }
            queueMicrotask(() => writeSavedReels(next))
            return next
        })
        setVideos((prev) => updateSavedVideoState(prev, reelId, optimisticSaved))

        try {
            const { isSaved, unlockedBadges } = await toggleSavedReel(reelId)

            if (isSaved !== optimisticSaved) {
                setVideos((prev) => updateSavedVideoState(prev, reelId, isSaved))
                setSaved((prev) => {
                    const next = { ...prev, [reelId]: isSaved }
                    queueMicrotask(() => writeSavedReels(next))
                    return next
                })
            }
            showUnlockedBadges(unlockedBadges, showToast)
        } catch (error) {
            setSaved((prev) => {
                const next = { ...prev, [reelId]: previousSaved }
                queueMicrotask(() => writeSavedReels(next))
                return next
            })
            setVideos((prev) => updateSavedVideoState(prev, reelId, previousSaved))
            console.error("Save request failed:", error)
        } finally {
            pendingActions.current.delete(actionKey)
        }
    }

    const handleMuteToggle = (reelId) => {
        setMutedReels((prev) => ({
            ...prev,
            [reelId]: !prev[reelId],
        }))
    }

    const handleReelTogglePlay = (reelId) => {
        const reelKey = String(reelId)

        if (reelKey !== String(activeReelId)) {
            return
        }

        const videoElement = videoRefs.current[reelId] || videoRefs.current[reelKey]

        if (!videoElement) {
            return
        }

        const willPause = !videoElement.paused

        setPausedReels((prev) => ({
            ...prev,
            [reelKey]: willPause,
        }))

        if (willPause) {
            videoElement.pause()
            return
        }

        const playPromise = videoElement.play()

        if (playPromise?.catch) {
            playPromise.catch(() => {})
        }
    }

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg)] px-6 text-center text-[var(--color-text-secondary)] md:h-full">
                Loading reels...
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg)] px-6 text-center md:h-full">
                <div className="max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
                    <p className="text-lg font-semibold">Feed unavailable</p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{loadError}</p>
                </div>
            </div>
        )
    }

    if (!videos.length) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg)] px-6 text-center md:h-full">
                <div className="max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
                    <p className="text-lg font-semibold">No reels yet</p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        The feed is connected, but there is no reel data to display yet.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={scrollContainerRef}
            // className="h-full w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll bg-black md:h-full md:bg-[var(--color-bg)]" with scrollbar
            className="h-full w-full snap-y snap-mandatory overflow-x-hidden overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:h-full md:bg-[var(--color-bg)]"
        >
            {videos.map((reel) => {
                const creatorId = reel?.creator?._id || reel?.creator || reel?.creatorId
                const followed = !!isFollowing[creatorId]
                const creator = {
                    name: reel.creatorName || reel?.creator?.name || "Creator",
                    avatar: reel.creatorAvatar || reel?.creator?.profile_picture || "https://i.pravatar.cc/96?img=12",
                    caption: reel.caption || reel.description || "Fresh food reel",
                }
                const reelId = String(reel._id)
                const isActiveReel = reelId === String(activeReelId)
                const isPaused = !!pausedReels[reelId]

                return (
                    <div
                        key={reel._id}
                        ref={(element) => {
                            if (element) {
                                reelRefs.current[reel._id] = element
                                return
                            }

                            delete reelRefs.current[reel._id]
                        }}
                        data-reel-id={reel._id}
                        className="relative flex h-full w-full snap-center snap-always items-center justify-center px-0 pt-0 md:h-full md:px-6 md:pt-7"
                    >
                        <div className="flex h-full w-full max-w-none items-center justify-center gap-0 md:h-[92dvh] md:max-w-[940px] md:gap-6">
                            <div className="relative h-full w-full max-h-none overflow-hidden rounded-none border-0 bg-black shadow-none md:max-h-[94dvh] md:w-auto md:aspect-[9/16] md:rounded-2xl md:border md:border-[var(--color-border)] md:shadow-[var(--shadow-lg)]">
                                <video
                                    ref={(element) => {
                                        if (element) {
                                            videoRefs.current[reel._id] = element
                                            return
                                        }

                                        delete videoRefs.current[reel._id]
                                    }}
                                    src={reel.video}
                                    aria-label={reel.name}
                                    className="h-full w-full object-cover"
                                    loop
                                    muted={mutedReels[reel._id] === true}
                                    playsInline
                                    preload="metadata"
                                    onTimeUpdate={(event) => handleVideoTimeUpdate(reel._id, event)}
                                />

                                <button
                                    type="button"
                                    aria-label={isPaused ? 'Play reel' : 'Pause reel'}
                                    className="absolute inset-0 z-[15] cursor-pointer border-0 bg-transparent p-0"
                                    onClick={() => handleReelTogglePlay(reel._id)}
                                />

                                {isActiveReel && isPaused && (
                                    <div
                                        className="pointer-events-none absolute inset-0 z-[14] flex items-center justify-center"
                                        aria-hidden
                                    >
                                        <Play
                                            className="h-20 w-20 fill-white text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                                            strokeWidth={0}
                                            aria-hidden
                                        />
                                    </div>
                                )}

                                <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-reel-overlay)]" />
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/65 via-black/20 to-transparent md:hidden" />

                                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center px-4 pt-4 md:hidden">
                                    <div className="flex items-center gap-1.5">
                                        <h2 className="text-lg font-semibold tracking-tight text-white">Reels</h2>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute bottom-2 left-1 right-0 z-20 flex items-end justify-between gap-3 px-3 md:hidden">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <div className="mb-3 flex items-center gap-3">
                                            {creatorId ? (
                                                <Link
                                                    to={`/creator/${creatorId}`}
                                                    onClick={(event) => event.stopPropagation()}
                                                    className="pointer-events-auto flex min-w-0 items-center gap-3"
                                                >
                                                    <img
                                                        src={creator.avatar}
                                                        alt={creator.name}
                                                        className="h-10 w-10 shrink-0 rounded-full border border-white/35 object-cover"
                                                    />
                                                    <p className="truncate text-[15px] font-semibold text-white">
                                                        {creator.name}
                                                    </p>
                                                </Link>
                                            ) : (
                                                <>
                                                    <img
                                                        src={creator.avatar}
                                                        alt={creator.name}
                                                        className="pointer-events-none h-10 w-10 rounded-full border border-white/35 object-cover"
                                                    />
                                                    <p className="pointer-events-none truncate text-[15px] font-semibold text-white">
                                                        {creator.name}
                                                    </p>
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    handleFollow(creatorId)
                                                }}
                                                className={`pointer-events-auto relative z-20 h-8 min-w-[78px] rounded-lg border px-3 text-xs font-semibold transition-all ${followed
                                                    ? "border-white bg-white text-black"
                                                    : "border-white/70 bg-transparent text-white backdrop-blur-sm"
                                                    }`}
                                            >
                                                {followed ? "Following" : "Follow"}
                                            </button>
                                        </div>

                                        <p className="pointer-events-none mb-3 line-clamp-2 text-sm leading-5 text-white drop-shadow-lg">
                                            {reel.description}
                                            {/* <span className="text-white/80"> more</span> */}
                                        </p>
                                    </div>

                                    <div className="pointer-events-auto flex w-10 flex-col items-center justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleLikeClick(reel)
                                            }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${liked[reel._id] ? 'fill-[var(--color-like)] text-[var(--color-like)]' : 'text-white'}`} fill={liked[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">{formatCount(reel.likeCount)}</span>
                                        </button>

                                        <button type="button" className="flex flex-col items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">{formatCount(reel.comments)}</span>
                                        </button>

                                        <button type="button" className="flex flex-col items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 -scale-x-100 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25 3.75 12m0 0 3.75 3.75M3.75 12h11.5a4.75 4.75 0 0 1 0 9.5H14.25" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">Share</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleSaveClick(reel)
                                            }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${saved[reel._id] ? 'fill-[var(--color-save)] text-[var(--color-save)]' : 'text-white'}`} fill={saved[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">{formatCount(reel.bookmarkCount)}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleMuteToggle(reel._id)}
                                            aria-label={mutedReels[reel._id] === true ? "Unmute reel" : "Mute reel"}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm">
                                                {mutedReels[reel._id] === true ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.5 8.25 5.25 7.5m0-7.5-5.25 7.5" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75a4.5 4.5 0 0 1 0 4.5m2.25-6.75a7.5 7.5 0 0 1 0 9" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute bottom-16 left-2 right-2 z-20 hidden md:block md:bottom-1 md:left-4 md:right-4">
                                    <div className="flex items-center gap-3">
                                        {creatorId ? (
                                            <Link
                                                to={`/creator/${creatorId}`}
                                                onClick={(event) => event.stopPropagation()}
                                                className="pointer-events-auto flex min-w-0 items-center gap-3"
                                            >
                                                <img
                                                    src={creator.avatar}
                                                    alt={creator.name}
                                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                                />
                                                <p className="truncate text-sm font-semibold leading-tight text-white">
                                                    {creator.name}
                                                </p>
                                            </Link>
                                        ) : (
                                            <>
                                                <img
                                                    src={creator.avatar}
                                                    alt={creator.name}
                                                    className="pointer-events-none h-9 w-9 rounded-full object-cover"
                                                />
                                                <p className="pointer-events-none truncate text-sm font-semibold leading-tight text-white">
                                                    {creator.name}
                                                </p>
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleFollow(creatorId)
                                            }}
                                            className={`pointer-events-auto relative z-20 h-8 min-w-[40px] rounded-2xl border px-3 text-[11px] leading-none transition-all ${followed
                                                ? "border-white bg-white text-black"
                                                : "border-white/75 bg-white/10 text-white backdrop-blur-sm"
                                                }`}
                                        >
                                            {followed ? "Following" : "Follow"}
                                        </button>
                                    </div>

                                    <div className="-mt-1 flex items-center justify-between gap-3">
                                        <p className="pointer-events-none line-clamp-1 text-sm text-white drop-shadow-lg">
                                            {creator.caption}
                                            <span className="text-white/80"> ... more</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleMuteToggle(reel._id)}
                                            aria-label={mutedReels[reel._id] === true ? "Unmute reel" : "Mute reel"}
                                            className="pointer-events-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-backdrop)] text-white"
                                        >
                                            {mutedReels[reel._id] === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.5 8.25 5.25 7.5m0-7.5-5.25 7.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75a4.5 4.5 0 0 1 0 4.5m2.25-6.75a7.5 7.5 0 0 1 0 9" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-white/25">
                                    <div
                                        ref={(element) => {
                                            if (element) {
                                                progressBarRefs.current[reelId] = element
                                                return
                                            }

                                            delete progressBarRefs.current[reelId]
                                        }}
                                        className="h-full bg-white will-change-[width]"
                                        style={{ width: '0%' }}
                                    />
                                </div>
                            </div>

                            <div className="hidden w-16 flex-col items-center justify-end gap-5 pb-10 md:flex md:w-20 md:pb-14">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        handleLikeClick(reel)
                                    }}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-backdrop)] backdrop-blur-sm transition-all group-active:scale-90 group-hover:bg-[color:var(--color-scrim)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${liked[reel._id] ? 'fill-[var(--color-like)] text-[var(--color-like)]' : 'text-white'}`} fill={liked[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-white/90 md:text-sm">{reel.likeCount || 0}</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-backdrop)] backdrop-blur-sm transition-all group-active:scale-90 group-hover:bg-[color:var(--color-scrim)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-white/90 md:text-sm">{reel.comments || 0}</span>
                                </button>

                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-backdrop)] backdrop-blur-sm transition-all group-active:scale-90 group-hover:bg-[color:var(--color-scrim)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25 3.75 12m0 0 3.75 3.75M3.75 12h11.5a4.75 4.75 0 0 1 0 9.5H14.25" />
                                    </svg>
                                    </div>
                                    <span className="text-xs font-medium text-white/90 md:text-sm">Share</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        handleSaveClick(reel)
                                    }}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-backdrop)] backdrop-blur-sm transition-all group-active:scale-90 group-hover:bg-[color:var(--color-scrim)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${saved[reel._id] ? 'fill-[var(--color-save)] text-[var(--color-save)]' : 'text-white'}`} fill={saved[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-white/90 md:text-sm">{reel.bookmarkCount || 0}</span>
                                </button>


                                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-backdrop)] text-3xl leading-none text-white">...</button>
                            </div>
                        </div>
                    </div>
                )
            })}

            {hasMore && (
                <div
                    ref={loadMoreSentinelRef}
                    className="flex h-8 w-full shrink-0 snap-none items-center justify-center"
                    aria-hidden
                >
                    {loadingMore && (
                        <span className="text-xs text-white/60 md:text-[var(--color-text-secondary)]">
                            Loading more...
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default HomeReels
