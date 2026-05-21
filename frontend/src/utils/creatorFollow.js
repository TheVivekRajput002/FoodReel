import axios from "axios"

export function buildInitialFollowState(reels) {
    return reels.reduce((followState, reel) => {
        const creatorId = reel?.creator?._id || reel?.creator || reel?.creatorId

        if (!creatorId) {
            return followState
        }

        followState[creatorId] = !!reel.isFollowed
        return followState
    }, {})
}

export async function toggleFollowCreator(creatorId) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/creator/${creatorId}/follow`,
        {},
        { withCredentials: true }
    )

    return response.data.action === "followed"
}
