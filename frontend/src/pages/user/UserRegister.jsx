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

function SocialGitHubIcon() {
    return (
        <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

                <div className="mt-5 mb-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dotted border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-slate-400 uppercase tracking-widest">Or sign up with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        aria-label="Sign up with Google"
                    >
                        <SocialGoogleIcon />
                    </button>
                    <button
                        type="button"
                        onClick={handleSocialClick}
                        className="flex justify-center items-center py-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-900"
                        aria-label="Sign up with GitHub"
                    >
                        <SocialGitHubIcon />
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
