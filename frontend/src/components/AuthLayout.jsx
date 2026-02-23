import React from 'react'

/**
 * AuthLayout — shared wrapper for all auth pages.
 * Centers the card on a subtle patterned background.
 *
 * Props:
 *  - children   : form content
 *  - badge      : short label shown above the title  (e.g. "User" / "Food Partner")
 *  - title      : heading text
 *  - subtitle   : optional sub-heading
 */
function AuthLayout({ children, badge, title, subtitle }) {
    return (
        <div
            className="min-h-dvh flex items-center justify-center px-4 py-12"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* subtle grid pattern overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                    opacity: 0.6,
                }}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-sm">
                {/* Logo / Brand mark */}
                <div className="flex justify-center mb-8">
                    <div
                        className="flex items-center gap-2.5"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        <svg
                            width="32" height="32" viewBox="0 0 32 32" fill="none"
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                        >
                            <rect width="32" height="32" rx="8" fill="currentColor" opacity=".15" />
                            <path
                                d="M9 22c0-3.9 3.1-7 7-7s7 3.1 7 7"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            />
                            <circle cx="16" cy="11" r="3" fill="currentColor" />
                            <path
                                d="M12 17.5c-.8.3-1.5.8-2 1.4"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            />
                            <path
                                d="M20 17.5c.8.3 1.5.8 2 1.4"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            />
                        </svg>
                        <span
                            className="text-xl font-bold tracking-tight"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            SCS <span style={{ color: 'var(--color-primary)' }}>Food</span>
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div className="auth-card p-8">
                    {/* Badge */}
                    {badge && (
                        <div className="mb-4">
                            <span className="auth-badge">{badge}</span>
                        </div>
                    )}

                    {/* Heading */}
                    <h1
                        className="text-2xl font-semibold tracking-tight mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm mb-7" style={{ color: 'var(--color-text-secondary)' }}>
                            {subtitle}
                        </p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
