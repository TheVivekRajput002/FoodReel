import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
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
    const [loadError, setLoadError] = useState('')
    const reelRefs = useRef({})
    const videoRefs = useRef({})

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/reel/`, { withCredentials: true })
            .then(response => {
                const reels = response.data.reel || []
                setVideos(reels)
                setActiveReelId(reels[0]?._id ? String(reels[0]._id) : null)
                setIsFollowing(buildInitialFollowState(reels))
                setLiked(buildInitialLikedState(reels))
                setSaved(buildInitialSavedState(reels))
                setMutedReels(
                    reels.reduce((state, reel) => {
                        if (reel?._id) {
                            state[reel._id] = false
                        }

                        return state
                    }, {})
                )
                setLoadError('')
            })
            .catch((error) => {
                console.error('Failed to load reels:', error)
                setVideos([])
                setLoadError('Unable to load reels. Check that the backend is running and VITE_API_URL is correct.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

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
        if (!activeReelId) {
            return
        }

        axios.post(
            `${import.meta.env.VITE_API_URL}/api/reel/${activeReelId}/watch`,
            {},
            { withCredentials: true }
        )
            .then((response) => {
                showUnlockedBadges(response.data?.unlockedBadges, showToast)
            })
            .catch((error) => {
                console.log("reel watch tracking skipped", error)
            })
    }, [activeReelId, showToast])

    useEffect(() => {
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
        })
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

        try {
            const { isFollowed, unlockedBadges } = await toggleFollowCreator(creatorId)

            setIsFollowing((prev) => ({
                ...prev,
                [creatorId]: isFollowed
            }))
            showUnlockedBadges(unlockedBadges, showToast)
        } catch (error) {
            console.error("Follow request failed:", error)
        }
    }

    const handleLikeClick = async (reel) => {
        try {
            const isLiked = await toggleLikedReel(reel._id)

            setVideos((prev) => updateLikedVideoState(prev, reel._id, isLiked))
            setLiked((prev) => {
                const next = { ...prev, [reel._id]: isLiked }
                writeLikedReels(next)
                return next
            })
        } catch (error) {
            console.error("Like request failed:", error)
        }
    }

    const handleSaveClick = async (reel) => {
        try {
            const { isSaved, unlockedBadges } = await toggleSavedReel(reel._id)

            setVideos((prev) => updateSavedVideoState(prev, reel._id, isSaved))
            showUnlockedBadges(unlockedBadges, showToast)
            setSaved((prev) => {
                const next = { ...prev, [reel._id]: isSaved }
                writeSavedReels(next)
                return next
            })
        } catch (error) {
            console.error("Save request failed:", error)
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
        <div className="h-full w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll bg-black md:h-full md:bg-[var(--color-bg)]">
            {videos.map((reel) => {
                const creatorId = reel?.creator?._id || reel?.creator || reel?.creatorId
                const followed = !!isFollowing[creatorId]
                const creator = {
                    name: reel.creatorName || reel?.creator?.name || "Creator",
                    avatar: reel.creatorAvatar || reel?.creator?.profile_picture || "https://i.pravatar.cc/96?img=12",
                    caption: reel.caption || "Fresh food reel",
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
                                />

                                <button
                                    type="button"
                                    aria-label={isPaused ? 'Play reel' : 'Pause reel'}
                                    className="absolute inset-0 z-[12] cursor-pointer border-0 bg-transparent p-0"
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

                                <div className="absolute inset-x-0 top-0 z-20 flex items-center px-4 pt-4 md:hidden">
                                    <div className="flex items-center gap-1.5">
                                        <h2 className="text-lg font-semibold tracking-tight text-white">Reels</h2>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="absolute bottom-2 left-1 right-0 z-20 flex items-end justify-between gap-3 px-3 md:hidden">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <div className="mb-3 flex items-center gap-3">
                                            <img
                                                src={creator.avatar}
                                                alt={creator.name}
                                                className="h-10 w-10 rounded-full border border-white/35 object-cover"
                                            />
                                            <p className="truncate text-[15px] font-semibold text-white">
                                                {creator.name}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => handleFollow(creatorId)}
                                                className={`h-8 min-w-[78px] rounded-lg border px-3 text-xs font-semibold transition-all ${followed
                                                    ? "border-white bg-white text-black"
                                                    : "border-white/70 bg-transparent text-white backdrop-blur-sm"
                                                    }`}
                                            >
                                                {followed ? "Following" : "Follow"}
                                            </button>
                                        </div>

                                        <p className="mb-3 line-clamp-2 text-sm leading-5 text-white drop-shadow-lg">
                                            {reel.description}
                                            {/* <span className="text-white/80"> more</span> */}
                                        </p>
                                    </div>

                                    <div className="flex w-10 flex-col items-center justify-end gap-4">
                                        <button
                                            onClick={() => handleLikeClick(reel)}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${liked[reel._id] ? 'fill-[var(--color-like)] text-[var(--color-like)]' : 'text-white'}`} fill={liked[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">{formatCount(reel.likeCount)}</span>
                                        </button>

                                        <button className="flex flex-col items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">{formatCount(reel.comments)}</span>
                                        </button>

                                        <button className="flex flex-col items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 -scale-x-100 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25 3.75 12m0 0 3.75 3.75M3.75 12h11.5a4.75 4.75 0 0 1 0 9.5H14.25" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-white">Share</span>
                                        </button>

                                        <button
                                            onClick={() => handleSaveClick(reel)}
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

                                <div className="absolute bottom-16 left-2 right-2 z-10 hidden md:block md:bottom-1 md:left-4 md:right-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={creator.avatar}
                                            alt={creator.name}
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                        <p className="truncate text-sm font-semibold leading-tight text-white">
                                            {creator.name}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => handleFollow(creatorId)}
                                            className={`relative z-20 h-8 min-w-[40px] rounded-2xl border px-3 text-[11px] leading-none transition-all ${followed
                                                ? "border-white bg-white text-black"
                                                : "border-white/75 bg-white/10 text-white backdrop-blur-sm"
                                                }`}
                                        >
                                            {followed ? "Following" : "Follow"}
                                        </button>
                                    </div>

                                    <div className="-mt-1 flex items-center justify-between gap-3">
                                        <p className="line-clamp-1 text-sm text-white drop-shadow-lg">
                                            {creator.caption}
                                            <span className="text-white/80"> ... more</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleMuteToggle(reel._id)}
                                            aria-label={mutedReels[reel._id] === true ? "Unmute reel" : "Mute reel"}
                                            className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-backdrop)] text-white"
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
                            </div>

                            <div className="hidden w-16 flex-col items-center justify-end gap-5 pb-10 md:flex md:w-20 md:pb-14">
                                <button
                                    onClick={() => handleLikeClick(reel)}
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
                                    onClick={() => handleSaveClick(reel)}
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
        </div>
    )
}

export default HomeReels
