import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'

function UserRegister() {
    return (
        <AuthLayout
            badge="User"
            title="Create your account"
            subtitle="Join SCS Food and discover amazing meals near you."
        >
            <form className="flex flex-col gap-5" noValidate>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="first-name" className="auth-label">First name</label>
                        <input
                            id="first-name"
                            type="text"
                            placeholder="John"
                            className="auth-input"
                            autoComplete="given-name"
                        />
                    </div>
                    <div>
                        <label htmlFor="last-name" className="auth-label">Last name</label>
                        <input
                            id="last-name"
                            type="text"
                            placeholder="Doe"
                            className="auth-input"
                            autoComplete="family-name"
                        />
                    </div>
                </div>

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
                    <a href="#" className="auth-link text-xs">Terms of Service</a> and{' '}
                    <a href="#" className="auth-link text-xs">Privacy Policy</a>.
                </p>

                <button type="submit" className="auth-btn-primary">
                    Create account
                </button>
            </form>

            {/* Footer link */}
            <p
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Already have an account?{' '}
                <Link to="/user/login" className="auth-link">Sign in</Link>
            </p>

            <div className="auth-divider mt-6 mb-5 text-xs">or</div>

            <p
                className="text-center text-xs"
                style={{ color: 'var(--color-text-muted)' }}
            >
                Are you a restaurant?{' '}
                <Link to="/food-partner/register" className="auth-link text-xs">
                    Register as Food Partner
                </Link>
            </p>
        </AuthLayout>
    )
}

export default UserRegister
