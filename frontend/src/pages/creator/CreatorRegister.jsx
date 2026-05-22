import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ImagePlus, Lock, Mail, Sparkles, Upload, User } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

function SocialGoogleIcon() {
    return (
        <svg height="18" viewBox="0 0 48 48" width="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="opacity-80 grayscale">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
            <path d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
        </svg>
    )
}

function SocialFacebookIcon() {
    return (
        <svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-[var(--cr-on-surface-variant)]">
            <path
                fill="currentColor"
                d="M14 13.5h2.5l.38-2.47H14v-1.16c0-.71.2-1.2 1.24-1.2h1.32V6.88c-.23-.03-1.02-.1-1.94-.1-1.92 0-3.27 1.17-3.27 3.32v1.5H9v2.47h2.75V22h2.25v-8.5Z"
            />
        </svg>
    )
}

function SocialAppleIcon() {
    return (
        <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-[var(--cr-on-surface-variant)]">
            <path d="M17.05 20.28c-.96.78-2.1 1.24-3.3 1.24-1.28 0-2.08-.34-2.84-.34-.76 0-1.64.34-2.85.34-1.4 0-2.62-.64-3.72-2C2.1 16.74 1.44 13.52 2.3 11.2c.54-1.52 1.84-2.48 3.3-2.48.96 0 1.76.44 2.44.44.66 0 1.62-.5 2.82-.5 1.52 0 2.8.76 3.56 1.96-3.1 1.34-2.6 5.5.6 6.84-.54 1.3-1.2 2.1-1.97 2.82zM12.03 7.25c-.02-2.3 1.9-4.22 4.22-4.25.02 2.22-1.88 4.25-4.22 4.25z" />
        </svg>
    )
}

function CreatorRegisterField({ id, name, type, placeholder, icon: Icon, autoComplete }) {
    return (
        <div className="creator-register-field">
                <div className="creator-register-field-icon">
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />
                </div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className="creator-register-input-icon"
                />
        </div>
    )
}

function CreatorRegister() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)

    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        }
    }, [avatarPreview])

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            showToast('Please choose an image file.', 'error')
            return
        }

        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = e.target.name.value.trim()
        const email = e.target.email.value.trim()
        const password = e.target.password.value

        if (!name || !email || !password) {
            showToast('Name, email, and password are required.', 'error')
            return
        }

        setIsSubmitting(true)

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/creator/register`,
                { name, email, password },
                { withCredentials: true }
            )

            localStorage.setItem('scs_auth', 'true')
            localStorage.setItem('scs_role', 'creator')
            showToast('Creator account created successfully.', 'success')
            navigate('/create-reel')
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
        <div className="creator-register-shell relative overflow-hidden">
            <div className="creator-register-accent-top" aria-hidden="true" />
            <div className="creator-register-accent-bottom" aria-hidden="true" />

            <div className="creator-register-inner">
                <main className="creator-register-glass-card">
                    <header className="text-center mb-3">
                        <div className="flex justify-center mb-2">
                            <div className="creator-register-header-icon">
                                <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
                            </div>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-[var(--cr-primary)] mb-1">
                            Create Creator Account
                        </h1>
                        <p className="text-xs text-[var(--cr-on-surface-variant)] mx-auto leading-snug">
                            List your restaurant on SCS Food.
                        </p>
                    </header>

                    <form className="space-y-2" noValidate onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-2">
                            <label className="creator-register-avatar-wrap group">
                                <div className="creator-register-avatar-ring">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImagePlus
                                            size={22}
                                            strokeWidth={1.5}
                                            className="text-[var(--cr-on-surface-variant)] group-hover:text-[var(--cr-secondary)] transition-colors"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                                <div className="creator-register-avatar-badge">
                                    <Upload size={12} strokeWidth={2} aria-hidden="true" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="creator-register-avatar-input"
                                    onChange={handleAvatarChange}
                                    aria-label="Upload profile picture"
                                />
                            </label>
                            <p className="mt-1 text-[10px] font-medium text-[var(--cr-on-surface-variant)]">
                                Profile photo
                            </p>
                        </div>

                        <CreatorRegisterField
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            icon={User}
                            autoComplete="name"
                        />
                        <CreatorRegisterField
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon={Mail}
                            autoComplete="email"
                        />
                        <CreatorRegisterField
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon={Lock}
                            autoComplete="new-password"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="creator-register-btn-primary mt-1"
                        >
                            {isSubmitting ? 'Creating account…' : 'Join as Creator'}
                        </button>
                    </form>

                    <div className="flex items-center my-3">
                        <div className="flex-grow border-t border-[var(--cr-outline-variant)]" />
                        <span className="px-2 text-[10px] font-medium text-[var(--cr-on-surface-variant)]">
                            or continue with
                        </span>
                        <div className="flex-grow border-t border-[var(--cr-outline-variant)]" />
                    </div>

                    <div className="flex justify-center gap-2.5 mb-3">
                        <button
                            type="button"
                            onClick={handleSocialClick}
                            className="creator-register-social-square"
                            aria-label="Sign up with Google"
                        >
                            <SocialGoogleIcon />
                        </button>
                        <button
                            type="button"
                            onClick={handleSocialClick}
                            className="creator-register-social-square"
                            aria-label="Sign up with Facebook"
                        >
                            <SocialFacebookIcon />
                        </button>
                        <button
                            type="button"
                            onClick={handleSocialClick}
                            className="creator-register-social-square"
                            aria-label="Sign up with Apple"
                        >
                            <SocialAppleIcon />
                        </button>
                    </div>

                    <footer className="text-center space-y-1">
                        <p className="text-xs text-[var(--cr-on-surface-variant)]">
                            Already have an account?{' '}
                            <Link
                                to="/creator/login"
                                className="text-[var(--cr-primary)] font-semibold hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-[10px] text-[var(--cr-outline)]">
                            Ordering food?{' '}
                            <Link to="/user/register" className="text-[var(--cr-secondary)] font-semibold hover:underline">
                                Register as User
                            </Link>
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default CreatorRegister
