export const DUMMY_STACKS = [
    {
        id: 'stack-1',
        title: 'The Almanack of Naval Ravikant',
        creator: 'Eric Jorgenson',
        coverImage:
            'https://www.bbassets.com/media/uploads/p/l/40342334_1-harperbusiness-the-almanack-of-naval-ravikant.jpg',
        views: '17K',
        saves: '2.8K',
        cards: [
            {
                head: 'Specific Knowledge',
                content: 'Specific knowledge cannot be taught, but it can be learned. It comes from following your natural curiosity, your lived experience, and the things you do better than almost anyone else.',
            }
        ]
    },
    {
        id: 'stack-2',
        title: 'Atomic Habits',
        creator: 'James Clear',
        coverImage:
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',

        views: '9.4K',
        saves: '1.7K',
        cards: [
            {
                head: 'Identity Drives Behavior',
                content: 'Lasting change gets easier when habits become evidence for the kind of person you believe you are.',
            }
        ]
    },
]

export function getStackById(stackId) {
    return DUMMY_STACKS.find((stack) => stack.id === stackId) ?? null
}
