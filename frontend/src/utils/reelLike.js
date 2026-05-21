import axios from "axios"

export const LIKED_STORAGE_KEY = "home_reels_liked_state"

export function readLikedReels() {
    try {
        return JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || "{}")
    } catch (error) {
        return {}
    }
}

export function writeLikedReels(likedState) {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedState))
}

export function buildInitialLikedState(reels) {
    const storedLiked = readLikedReels()

    return reels.reduce((likedState, reel) => {
        const reelId = reel?._id

        if (!reelId) {
            return likedState
        }

        likedState[reelId] = typeof reel?.isLiked === "boolean" ? reel.isLiked : !!storedLiked[reelId]
        return likedState
    }, {})
}

export async function toggleLikedReel(reelId) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reel/like`,
        { reelId },
        { withCredentials: true }
    )

    return !!response.data.like
}

export function updateLikedVideoState(videos, reelId, isLiked) {
    return videos.map((video) => {
        if (video._id !== reelId) {
            return video
        }

        const currentCount = Number(video.likeCount) || 0

        return {
            ...video,
            likeCount: Math.max(0, currentCount + (isLiked ? 1 : -1)),
        }
    })
}
