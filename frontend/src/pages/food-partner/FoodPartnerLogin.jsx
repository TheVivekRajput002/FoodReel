import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'

function FoodPartnerLogin() {
    return (
        <AuthLayout
            badge="Food Partner"
            title="Partner sign in"
            subtitle="Access your restaurant dashboard."
        >
            <form className="flex flex-col gap-5" noValidate>

                {/* Business email */}
                <div>
                    <label htmlFor="business-email" className="auth-label">Business email</label>
                    <input
                        id="business-email"
                        type="email"
                        placeholder="orders@yourrestaurant.com"
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
                    Stay signed in
                </label>

                <button type="submit" className="auth-btn-primary">
                    Sign in to dashboard
                </button>
            </form>

            {/* Footer link */}
            <p
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Not a partner yet?{' '}
                <Link to="/food-partner/register" className="auth-link">Apply now</Link>
            </p>

            <div className="auth-divider mt-6 mb-5 text-xs">or</div>

            <p
                className="text-center text-xs"
                style={{ color: 'var(--color-text-muted)' }}
            >
                Looking to order food?{' '}
                <Link to="/user/login" className="auth-link text-xs">
                    Sign in as User
                </Link>
            </p>
        </AuthLayout>
    )
}

export default FoodPartnerLogin
