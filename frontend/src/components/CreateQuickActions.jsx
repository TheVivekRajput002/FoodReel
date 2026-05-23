import { BookOpenText, Video } from 'lucide-react'

const CREATE_OPTIONS = [
    {
        key: 'reel',
        label: 'Reel',
        hint: 'Short video',
        icon: Video,
    },
    {
        key: 'stack',
        label: 'Stack',
        hint: 'Book insights',
        icon: BookOpenText,
    },
]

export default function CreateQuickActions({ isOpen, onClose, onSelect }) {
    if (!isOpen) {
        return null
    }

    return (
        <>
            <button
                type="button"
                aria-label="Close create menu"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-[var(--color-backdrop)]/50 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
            />

            <div
                role="dialog"
                aria-label="Create content"
                className="fixed z-50 w-[min(calc(100vw-2rem),220px)] left-1/2 -translate-x-1/2 bottom-[4.25rem] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-lg)] md:left-[100px] md:bottom-6 md:translate-x-0"
            >
                <div className="border-b border-[var(--color-border)] px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Create</p>
                </div>

                <div className="grid grid-cols-2 gap-1 p-1.5">
                    {CREATE_OPTIONS.map((option) => {
                        const Icon = option.icon

                        return (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => onSelect(option.key)}
                                className="group flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition-colors hover:bg-[var(--color-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
                            >
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-transform group-hover:scale-105">
                                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                                        {option.label}
                                    </p>
                                    <p className="text-[10px] leading-tight text-[var(--color-text-muted)]">
                                        {option.hint}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
