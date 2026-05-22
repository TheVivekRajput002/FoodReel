import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

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

function SocialFacebookIcon() {
    return (
        <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" fill="#039be5" />
            <path d="M26.572 29.036h4.917l.772-4.995h-5.69v-2.73c0-2.075.678-3.915 2.619-3.915h3.119v-4.359c-.548-.074-1.707-.236-3.897-.236-4.573 0-7.254 2.415-7.254 8.23v3.01h-4.37v4.995h4.37v11.666c.895.14 1.812.214 2.744.214c.813 0 1.61-.057 2.392-.162V29.036Z" fill="#fff" />
        </svg>
    )
}

function SocialAppleIcon() {
    return (
        <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17.05 20.28c-.96.78-2.1 1.24-3.3 1.24-1.28 0-2.08-.34-2.84-.34-.76 0-1.64.34-2.85.34-1.4 0-2.62-.64-3.72-2C2.1 16.74 1.44 13.52 2.3 11.2c.54-1.52 1.84-2.48 3.3-2.48.96 0 1.76.44 2.44.44.66 0 1.62-.5 2.82-.5 1.52 0 2.8.76 3.56 1.96-3.1 1.34-2.6 5.5.6 6.84-.54 1.3-1.2 2.1-1.97 2.82zM12.03 7.25c-.02-2.3 1.9-4.22 4.22-4.25.02 2.22-1.88 4.25-4.22 4.25z" />
        </svg>
    )
}

function UserLogin() {
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

    const handleSocialClick = () => {
        showToast('Social sign-in is not available yet.', 'info')
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
                        Make a new doc to bring your words, data, and teams together. For free
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

                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        aria-label="Sign in with Google"
                    >
                        <SocialGoogleIcon />
                    </button>
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        aria-label="Sign in with Facebook"
                    >
                        <SocialFacebookIcon />
                    </button>
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-900"
                        aria-label="Sign in with Apple"
                    >
                        <SocialAppleIcon />
                    </button>
                </div>
            </main>
        </div>
    )
}

export default UserLogin
