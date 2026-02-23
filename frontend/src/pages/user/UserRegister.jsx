import React from 'react'
import { Link } from 'react-router-dom'

function UserRegister() {
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
                        Create your account
                    </h1>
                    <p className="text-sm mb-7" style={{ color: 'var(--color-text-secondary)' }}>
                        Join SCS Food and discover amazing meals near you.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-5" noValidate>

                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="first-name" className="auth-label">First name</label>
                                <input id="first-name" type="text" placeholder="John" className="auth-input" autoComplete="given-name" />
                            </div>
                            <div>
                                <label htmlFor="last-name" className="auth-label">Last name</label>
                                <input id="last-name" type="text" placeholder="Doe" className="auth-input" autoComplete="family-name" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="auth-label">Email address</label>
                            <input id="email" type="email" placeholder="you@example.com" className="auth-input" autoComplete="email" />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="auth-label">Password</label>
                            <input id="password" type="password" placeholder="Create a strong password" className="auth-input" autoComplete="new-password" />
                        </div>

                        {/* Terms */}
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            By signing up you agree to our{' '}
                            <a href="#" className="auth-link text-xs">Terms of Service</a> and{' '}
                            <a href="#" className="auth-link text-xs">Privacy Policy</a>.
                        </p>

                        <button type="submit" className="auth-btn-primary">Create account</button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Already have an account?{' '}
                        <Link to="/user/login" className="auth-link">Sign in</Link>
                    </p>

                    <div className="auth-divider mt-6 mb-5 text-xs">or</div>

                    <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Are you a restaurant?{' '}
                        <Link to="/food-partner/register" className="auth-link text-xs">Register as Food Partner</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default UserRegister
