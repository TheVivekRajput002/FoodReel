import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Lock, Mail, Sparkles, User, UserRound } from 'lucide-react'
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

const inputClass =
    'w-full h-10 bg-slate-100/70 border border-slate-200/60 rounded-xl pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300/60 focus:bg-white focus:border-sky-200 transition-all outline-none'

function AuthField({ id, name, type, placeholder, icon: Icon, autoComplete, required = true }) {
    return (
        <div className="space-y-1">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className={inputClass}
                />
            </div>
        </div>
    )
}

function UserRegister() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = e.target.name.value.trim()
        const username = e.target.username.value.trim()
        const email = e.target.email.value.trim()
        const password = e.target.password.value

        if (!name || !username || !email || !password) {
            showToast('All fields are required.', 'error')
            return
        }

        setIsSubmitting(true)

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/user/register`,
                { name, username, email, password },
                { withCredentials: true }
            )

            localStorage.setItem('scs_auth', 'true')
            localStorage.setItem('scs_role', 'user')
            showToast('Account created successfully.', 'success')
            navigate('/user/profile')
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to create account. Please try again.'
            showToast(message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSocialClick = () => {
        showToast('Social sign-up is not available yet.', 'info')
    }

    return (
        <div className="user-login-shell relative px-3 py-2 font-sans antialiased overflow-y-auto">
            <main className="user-auth-card w-full max-w-[340px] rounded-2xl p-5 my-auto shrink-0">
                <header className="text-center mb-4">
                    <div className="flex justify-center mb-2">
                        <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        </div>
                    </div>
                    <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-xs text-slate-500 leading-snug">
                        Join SCS Food to discover reels and local partners.
                    </p>
                </header>

                <form className="space-y-2" noValidate onSubmit={handleSubmit}>
                    <AuthField id="name" name="name" type="text" placeholder="Name" icon={User} autoComplete="name" />
                    <AuthField id="username" name="username" type="text" placeholder="Username" icon={UserRound} autoComplete="username" />
                    <AuthField id="email" name="email" type="email" placeholder="Email" icon={Mail} autoComplete="email" />
                    <AuthField id="password" name="password" type="password" placeholder="Password" icon={Lock} autoComplete="new-password" />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-10 bg-slate-800 text-white text-sm font-semibold rounded-xl mt-2 hover:bg-slate-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="px-3 text-[10px] font-medium uppercase tracking-wide text-slate-400">or continue with</span>
                    <div className="flex-grow border-t border-slate-200" />
                </div>

                <div className="flex justify-center gap-2.5 mb-3">
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        aria-label="Sign up with Google"
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
                    >
                        <SocialGoogleIcon />
                    </button>
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        aria-label="Sign up with Facebook"
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
                    >
                        <SocialFacebookIcon />
                    </button>
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        aria-label="Sign up with Apple"
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white/60 flex items-center justify-center hover:bg-white transition-colors text-slate-800"
                    >
                        <SocialAppleIcon />
                    </button>
                </div>

                <footer className="text-center space-y-1.5">
                    <p className="text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/user/login" className="text-slate-800 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <p className="text-[10px] text-slate-400">
                        Restaurant?{' '}
                        <Link to="/creator/register" className="text-sky-600 font-semibold hover:underline">
                            Register as Creator
                        </Link>
                    </p>
                </footer>
            </main>
        </div>
    )
}

export default UserRegister
