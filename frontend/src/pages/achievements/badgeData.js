export const BADGE_TIERS = ['bronze', 'silver', 'gold', 'platinum']

export const TIER_LABELS = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
}

export function normalizeBadge(badge) {
    return {
        id: badge?._id || badge?.id,
        name: badge?.name || 'Untitled Badge',
        description: badge?.description || '',
        iconUrl: badge?.iconUrl || '',
        tier: badge?.tier || 'bronze',
        pointsBonus: badge?.pointsBonus ?? 0,
        completed: Boolean(badge?.completed),
    }
}

export function getBadgesByTier(badges) {
    return BADGE_TIERS.reduce((grouped, tier) => {
        grouped[tier] = badges.filter((badge) => badge.tier === tier)
        return grouped
    }, {})
}
