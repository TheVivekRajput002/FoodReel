import React from 'react'
import { Link } from 'react-router-dom'

function FoodPartnerRegister() {
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
                        <span className="auth-badge">Food Partner</span>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-2xl font-semibold tracking-tight mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        List your restaurant
                    </h1>
                    <p className="text-sm mb-7" style={{ color: 'var(--color-text-secondary)' }}>
                        Partner with SCS Food and reach thousands of hungry customers.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-5" noValidate>

                        {/* Restaurant name */}
                        <div>
                            <label htmlFor="restaurant-name" className="auth-label">Restaurant name</label>
                            <input id="restaurant-name" type="text" placeholder="e.g. The Spice Kitchen" className="auth-input" autoComplete="organization" />
                        </div>

                        {/* Business email */}
                        <div>
                            <label htmlFor="business-email" className="auth-label">Business email</label>
                            <input id="business-email" type="email" placeholder="orders@yourrestaurant.com" className="auth-input" autoComplete="email" />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="auth-label">Password</label>
                            <input id="password" type="password" placeholder="Create a strong password" className="auth-input" autoComplete="new-password" />
                        </div>

                        {/* Terms */}
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            By signing up you agree to our{' '}
                            <a href="#" className="auth-link text-xs">Partner Terms</a> and{' '}
                            <a href="#" className="auth-link text-xs">Privacy Policy</a>.
                        </p>

                        <button type="submit" className="auth-btn-primary">Register restaurant</button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Already have a partner account?{' '}
                        <Link to="/food-partner/login" className="auth-link">Sign in</Link>
                    </p>

                    <div className="auth-divider mt-6 mb-5 text-xs">or</div>

                    <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Looking to order food?{' '}
                        <Link to="/user/register" className="auth-link text-xs">Register as User</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default FoodPartnerRegister
