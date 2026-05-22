import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const TOAST_STYLES = {
    success: {
        Icon: CheckCircle2,
        container: 'border-[var(--color-success)]/25 bg-[var(--color-success-soft)]',
        icon: 'text-[var(--color-success)]',
    },
    error: {
        Icon: XCircle,
        container: 'border-[var(--color-error)]/25 bg-[var(--color-error-soft)]',
        icon: 'text-[var(--color-error)]',
    },
    info: {
        Icon: Info,
        container: 'border-[var(--color-info)]/25 bg-[var(--color-info-soft)]',
        icon: 'text-[var(--color-info)]',
    },
}

export default function Toast({ toasts, onDismiss }) {
    if (!toasts.length) {
        return null
    }

    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-8"
        >
            {toasts.map((toast) => {
                const style = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info
                const { Icon } = style

                return (
                    <div
                        key={toast.id}
                        role="status"
                        className={`toast-enter pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-lg)] ${style.container}`}
                    >
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
                        <p className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
                            {toast.message}
                        </p>
                        <button
                            type="button"
                            onClick={() => onDismiss(toast.id)}
                            className="shrink-0 rounded-full p-1 text-[var(--color-text-muted)] transition hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]"
                            aria-label="Dismiss notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
