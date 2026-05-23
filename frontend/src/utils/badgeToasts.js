const BADGE_TOAST_GAP_MS = 4500

export function showUnlockedBadges(unlockedBadges, showToast) {
    if (!Array.isArray(unlockedBadges) || unlockedBadges.length === 0 || !showToast) {
        return
    }

    unlockedBadges.forEach((badge, index) => {
        const name = badge?.name || 'Achievement'
        const points = Number(badge?.pointsBonus) || 0
        const pointsSuffix = points > 0 ? ` +${points} bonus points` : ''
        const message = `Achievement unlocked: ${name}!${pointsSuffix}`

        setTimeout(() => {
            showToast(message, 'success')
        }, index * BADGE_TOAST_GAP_MS)
    })
}
