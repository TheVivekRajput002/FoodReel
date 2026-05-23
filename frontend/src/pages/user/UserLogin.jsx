import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
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

function UserLogin() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { showToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const oauthHandledRef = useRef(false)
    const googleAuthHref = getGoogleAuthHref('login')

    useEffect(() => {
        if (oauthHandledRef.current) return

        if (searchParams.get('oauth') === 'success') {
            oauthHandledRef.current = true
            localStorage.setItem('scs_auth', 'true')
            localStorage.setItem('scs_role', 'user')
            setSearchParams({}, { replace: true })
            navigate('/user/profile', { replace: true })
            return
        }

        const oauthError = searchParams.get('oauth_error')
        if (oauthError) {
            oauthHandledRef.current = true
            showToast(decodeURIComponent(oauthError), 'error')
            setSearchParams({}, { replace: true })
        }
    }, [searchParams, setSearchParams, navigate, showToast])

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
                `${import.meta.env.VITE_API_URL}/api/auth/user/login`,
                { email, password },
                { withCredentials: true }
            )

            localStorage.setItem('scs_auth', 'true')
            localStorage.setItem('scs_role', 'user')
            navigate('/user/profile')
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to sign in. Please try again.'
            showToast(message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGitHubClick = () => {
        showToast('GitHub sign-in is not available yet.', 'info')
    }

    return (
        <div className="user-login-shell p-3 font-sans antialiased text-slate-800">
            <main className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-blue-100 p-6 border border-white">
                <header className="flex flex-col items-center text-center mb-5">
                    <div className="bg-white rounded-xl p-2.5 shadow-md mb-3 border border-slate-50">
                        <LogIn className="text-slate-700" size={20} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Sign in with email</h1>
                    <p className="text-xs text-slate-500 leading-snug max-w-[240px]">
                        Be The One
                    </p>
                </header>

                <form className="space-y-3" noValidate onSubmit={handleSubmit}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" strokeWidth={2} aria-hidden="true" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            className="block w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all soft-input-shadow outline-none"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" strokeWidth={2} aria-hidden="true" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            className="block w-full pl-11 pr-11 py-2.5 bg-slate-100/50 border-none rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all soft-input-shadow outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <Eye className="h-5 w-5" strokeWidth={2} />
                            ) : (
                                <EyeOff className="h-5 w-5" strokeWidth={2} />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => showToast('Password reset is not available yet.', 'info')}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#242426] text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing in…' : 'Get Started'}
                    </button>
                </form>

                <div className="mt-5 mb-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dotted border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-slate-400 uppercase tracking-widest">Or sign in with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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

                <footer className="text-center space-y-1.5 mt-5">
                    <p className="text-xs text-slate-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/user/register" className="text-slate-800 font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                    <p className="text-[10px] text-slate-400">
                        Restaurant?{' '}
                        <Link to="/creator/login" className="text-sky-600 font-semibold hover:underline">
                            Sign in as Creator
                        </Link>
                    </p>
                </footer>
            </main>
        </div>
    )
}

export default UserLogin
