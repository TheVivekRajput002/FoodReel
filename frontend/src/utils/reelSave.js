import axios from "axios"

export const SAVED_STORAGE_KEY = "home_reels_saved_state"

export function readSavedReels() {
    try {
        return JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY) || "{}")
    } catch {
        return {}
    }
}

export function writeSavedReels(savedState) {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedState))
}

export function buildInitialSavedState(reels) {
    const storedSaved = readSavedReels()

    return reels.reduce((savedState, reel) => {
        const reelId = reel?._id

        if (!reelId) {
            return savedState
        }

        savedState[reelId] = typeof reel?.isSaved === "boolean" ? reel.isSaved : !!storedSaved[reelId]
        return savedState
    }, {})
}

export async function toggleSavedReel(reelId) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reel/${reelId}/save`,
        {},
        { withCredentials: true }
    )

    return {
        isSaved: Boolean(response.data.save),
        unlockedBadges: response.data.unlockedBadges ?? [],
    }
}

export function updateSavedVideoState(videos, reelId, isSaved) {
    return videos.map((video) => {
        if (video._id !== reelId) {
            return video
        }

        const currentCount = Number(video.bookmarkCount) || 0

        return {
            ...video,
            bookmarkCount: Math.max(0, currentCount + (isSaved ? 1 : -1)),
        }
    })
}
