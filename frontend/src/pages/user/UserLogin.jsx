import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'

function UserLogin() {
    return (
        <AuthLayout
            badge="User"
            title="Welcome back"
            subtitle="Sign in to your account to continue."
        >
            <form className="flex flex-col gap-5" noValidate>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="auth-label">Email address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="auth-input"
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="auth-label" style={{ marginBottom: 0 }}>
                            Password
                        </label>
                        <a href="#" className="auth-link text-xs">Forgot password?</a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="auth-input"
                        autoComplete="current-password"
                    />
                </div>

                {/* Remember me */}
                <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}
                >
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
                    />
                    Remember me for 30 days
                </label>

                <button type="submit" className="auth-btn-primary">
                    Sign in
                </button>
            </form>

            {/* Footer link */}
            <p
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Don&apos;t have an account?{' '}
                <Link to="/user/register" className="auth-link">Create one</Link>
            </p>

            <div className="auth-divider mt-6 mb-5 text-xs">or</div>

            <p
                className="text-center text-xs"
                style={{ color: 'var(--color-text-muted)' }}
            >
                Are you a restaurant?{' '}
                <Link to="/food-partner/login" className="auth-link text-xs">
                    Sign in as Food Partner
                </Link>
            </p>
        </AuthLayout>
    )
}

export default UserLogin
