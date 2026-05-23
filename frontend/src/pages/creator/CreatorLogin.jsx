import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { getGoogleAuthHref } from '../../utils/googleAuth'

function SocialGoogleIcon() {
    return (
        <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
            <path d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
        </svg>
    )
}

function SocialGitHubIcon() {
    return (
        <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    )
}

function CreatorLogin() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = e.target.email.value.trim()
        const password = e.target.password.value

        if (!email || !password) {
            showToast('Email and password are required.', 'error')
            return
        }

        setIsSubmitting(true)

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/creator/login`,
                { email, password },
                { withCredentials: true }
            )

            localStorage.setItem('scs_auth', 'true')
            localStorage.setItem('scs_role', 'creator')
            navigate('/creator/profile')
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to sign in. Please try again.'
            showToast(message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const googleAuthHref = getGoogleAuthHref('login')

    const handleGitHubClick = () => {
        showToast('GitHub sign-in is not available yet.', 'info')
    }

    return (
        <div className="creator-register-shell creator-login-shell relative overflow-hidden">
            <div className="creator-register-accent-top" aria-hidden="true" />
            <div className="creator-register-accent-bottom" aria-hidden="true" />

            <div className="creator-register-inner">
                <main className="creator-login-glass-card">
                    <header className="text-center mb-2">
                        <div className="flex justify-center mb-1.5">
                            <div className="creator-register-header-icon">
                                <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
                            </div>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-[var(--cr-primary)] mb-0.5">
                            Creator Sign In
                        </h1>
                        <p className="text-xs text-[var(--cr-on-surface-variant)] leading-snug">
                            Be The One to Bring Change
                        </p>
                    </header>

                    <form className="space-y-2" noValidate onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="creator-login-label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@creator.com"
                                autoComplete="email"
                                required
                                className="creator-login-input"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center ml-1 mb-1">
                                <label htmlFor="password" className="creator-login-label mb-0">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => showToast('Password reset is not available yet.', 'info')}
                                    className="text-[10px] font-medium text-[var(--cr-secondary)] hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="creator-login-input pr-9"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--cr-on-surface-variant)] hover:text-[var(--cr-secondary)]"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <Eye size={16} strokeWidth={2} />
                                    ) : (
                                        <EyeOff size={16} strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="creator-register-btn-primary mt-0.5"
                        >
                            {isSubmitting ? 'Signing in…' : 'Sign In as Creator'}
                        </button>
                    </form>

                    <div className="mt-5 mb-4 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dotted border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[var(--cr-surface-container-lowest,#ffffff)] text-slate-400 uppercase tracking-widest">
                                Or sign in with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <a
                            href={googleAuthHref}
                            className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm no-underline"
                            aria-label="Sign in with Google"
                        >
                            <SocialGoogleIcon />
                        </a>
                        <button
                            type="button"
                            onClick={handleGitHubClick}
                            className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-900"
                            aria-label="Sign in with GitHub"
                        >
                            <SocialGitHubIcon />
                        </button>
                    </div>

                    <footer className="text-center space-y-2.5">
                        <p className="text-xs text-[var(--cr-on-surface-variant)]">
                            Don&apos;t have a creator account?{' '}
                            <Link
                                to="/creator/register"
                                className="text-[var(--cr-secondary)] font-semibold hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                        <p className="text-[10px] text-[var(--cr-outline)]">
                            Ordering food?{' '}
                            <Link to="/user/login" className="text-[var(--cr-secondary)] font-semibold hover:underline">
                                Sign in as User
                            </Link>
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default CreatorLogin
