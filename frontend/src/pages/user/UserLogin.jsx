import React from 'react'
import { Link } from 'react-router-dom'

function UserLogin() {
    return (
        <div
            className="min-h-dvh flex items-center justify-center p-6"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="auth-card p-8">

                    {/* Badge */}
                    <div className="mb-4">
                        <span className="auth-badge">User</span>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-2xl font-semibold tracking-tight mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        Welcome back
                    </h1>
                    <p className="text-sm mb-7" style={{ color: 'var(--color-text-secondary)' }}>
                        Sign in to your account to continue.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-5" noValidate>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="auth-label">Email address</label>
                            <input id="email" type="email" placeholder="you@example.com" className="auth-input" autoComplete="email" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                               
                            </div>
                            <input id="password" type="password" placeholder="Enter your password" className="auth-input" autoComplete="current-password" />
                        </div>

                        <button type="submit" className="auth-btn-primary">Sign in</button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Don&apos;t have an account?{' '}
                        <Link to="/user/register" className="auth-link">Create one</Link>
                    </p>

                    <div className="auth-divider mt-6 mb-5 text-xs">or</div>

                    <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Are you a restaurant?{' '}
                        <Link to="/food-partner/login" className="auth-link text-xs">Sign in as Food Partner</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default UserLogin
