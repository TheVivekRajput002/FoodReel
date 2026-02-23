import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'

function FoodPartnerRegister() {
    return (
        <AuthLayout
            badge="Food Partner"
            title="List your restaurant"
            subtitle="Partner with SCS Food and reach thousands of hungry customers."
        >
            <form className="flex flex-col gap-5" noValidate>

                {/* Restaurant name */}
                <div>
                    <label htmlFor="restaurant-name" className="auth-label">Restaurant name</label>
                    <input
                        id="restaurant-name"
                        type="text"
                        placeholder="e.g. The Spice Kitchen"
                        className="auth-input"
                        autoComplete="organization"
                    />
                </div>

                {/* Owner name */}
                <div>
                    <label htmlFor="owner-name" className="auth-label">Owner / contact name</label>
                    <input
                        id="owner-name"
                        type="text"
                        placeholder="Full name"
                        className="auth-input"
                        autoComplete="name"
                    />
                </div>

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

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="auth-label">Phone number</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="auth-input"
                        autoComplete="tel"
                    />
                </div>

                {/* FSSAI / License */}
                <div>
                    <label htmlFor="fssai" className="auth-label">FSSAI license number</label>
                    <input
                        id="fssai"
                        type="text"
                        placeholder="14-digit FSSAI number"
                        className="auth-input"
                        maxLength={14}
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="auth-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        className="auth-input"
                        autoComplete="new-password"
                    />
                </div>

                {/* Confirm password */}
                <div>
                    <label htmlFor="confirm-password" className="auth-label">Confirm password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Repeat your password"
                        className="auth-input"
                        autoComplete="new-password"
                    />
                </div>

                {/* Terms */}
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    By signing up you agree to our{' '}
                    <a href="#" className="auth-link text-xs">Partner Terms</a> and{' '}
                    <a href="#" className="auth-link text-xs">Privacy Policy</a>.
                </p>

                <button type="submit" className="auth-btn-primary">
                    Register restaurant
                </button>
            </form>

            {/* Footer link */}
            <p
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Already have a partner account?{' '}
                <Link to="/food-partner/login" className="auth-link">Sign in</Link>
            </p>

            <div className="auth-divider mt-6 mb-5 text-xs">or</div>

            <p
                className="text-center text-xs"
                style={{ color: 'var(--color-text-muted)' }}
            >
                Looking to order food?{' '}
                <Link to="/user/register" className="auth-link text-xs">
                    Register as User
                </Link>
            </p>
        </AuthLayout>
    )
}

export default FoodPartnerRegister
