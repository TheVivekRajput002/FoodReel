import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useToast } from '../../context/ToastContext'
import { useNavigate } from 'react-router-dom'

function EditCreatorProfile() {
    const { showToast } = useToast()
    const [creator, setCreator] = useState(null)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [profession, setProfession] = useState('')
    const [phone, setPhone] = useState('')
    const [profilePreview, setProfilePreview] = useState('')
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const fileInputRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/creator/profile`, { withCredentials: true })
            .then((response) => {
                const data = response.data?.creator
                setCreator(data ?? null)
                setName(data?.name ?? '')
                setBio(data?.bio ?? '')
                setProfession(data?.Profession ?? data?.profession ?? '')
                setPhone(data?.phone ?? '')
            })
            .catch(() => {
                setCreator(null)
            })
    }, [])

    useEffect(() => {
        return () => {
            if (profilePreview) {
                URL.revokeObjectURL(profilePreview)
            }
        }
    }, [profilePreview])

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const handlePhotoSelect = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (profilePreview) {
            URL.revokeObjectURL(profilePreview)
        }

        setProfilePreview(URL.createObjectURL(file))
        uploadProfilePicture(file)
    }

    const uploadProfilePicture = async (file) => {
        try {
            setIsUploadingPhoto(true)
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/creator/profile-picture`,
                formData,
                { withCredentials: true }
            )

            const nextProfilePicture =
                response.data?.profile_picture ||
                response.data?.creator?.profile_picture

            setCreator((prev) =>
                prev ? { ...prev, profile_picture: nextProfilePicture ?? prev.profile_picture } : prev
            )
        } catch (error) {
            console.error('Profile picture upload failed:', error.response?.data || error.message)
        } finally {
            setIsUploadingPhoto(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // await axios.patch(
        //     `${import.meta.env.VITE_API_URL}/api/creator/profile`,
        //     { name, bio, profession, phone },
        //     { withCredentials: true }
        // )

        showToast('Profile updated successfully.', 'success')
        navigate('/creator/profile')
    }

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/creator/logout`, { withCredentials: true })
            localStorage.removeItem('scs_auth')
            navigate('/creator/login', { replace: true })
        } catch (errorLogMsg) {
            console.error('Logout failed', errorLogMsg)
        }
    }

    return (
        <div className="min-h-[100dvh] w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
            <div className="mx-auto w-full max-w-[1300px] px-4 py-8 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-7">
                    <aside className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 h-fit">
                        <h2 className="text-3xl font-bold">Settings</h2>

                        <div className="mt-5 h-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-input-bg)] px-4 flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </div>

                        <div className="mt-6 space-y-2">
                            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">How you use SCS Food</h3>
                            <button type="button" className="w-full h-12 rounded-xl bg-[var(--color-hover)] text-left px-4 font-semibold">Edit Profile</button>
                            <button type="button" className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Notifications</button>
                        </div>

                        <div className="mt-7 space-y-2">
                            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Who can see your content</h3>
                            <button type="button" className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Account privacy</button>
                            <button type="button" className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Blocked</button>
                        </div>

                        <div className="mt-7 hidden border-t border-[var(--color-border)] pt-4 lg:block">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-semibold text-[var(--color-danger)] transition-colors hover:bg-[var(--color-hover)]"
                            >
                                Logout
                            </button>
                        </div>
                    </aside>

                    <section className="w-full max-w-[760px]">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-4xl font-bold mb-7">Edit Profile</h1>

                            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="h-14 w-14 shrink-0 rounded-full bg-[var(--gradient-brand)] p-[2px]">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--color-bg)] text-lg font-bold text-[var(--color-text-on-primary)]">
                                                {profilePreview ? (
                                                    <img
                                                        src={profilePreview}
                                                        alt="Profile preview"
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : creator?.profile_picture ? (
                                                    <img
                                                        src={creator.profile_picture}
                                                        alt="Profile"
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    name?.charAt(0).toUpperCase() || 'C'
                                                )}
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xl font-bold leading-tight">{name || 'Business name'}</p>
                                            <p className="truncate text-lg text-[var(--color-text-secondary)]">{profession || 'Profession'}</p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoSelect}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleChangePhotoClick}
                                        disabled={isUploadingPhoto}
                                        className="h-10 w-full shrink-0 rounded-xl bg-[var(--color-primary)] px-5 font-semibold text-[var(--color-text-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 md:w-auto"
                                    >
                                        {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-3xl font-semibold" htmlFor="creator-name">Name</label>
                                <div className="mt-3">
                                    <input
                                        id="creator-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 text-lg outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-input-focus)]"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-3xl font-semibold" htmlFor="creator-bio">Bio</label>
                                <div className="mt-3 rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] p-4">
                                    <textarea
                                        id="creator-bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        maxLength={150}
                                        className="w-full h-24 bg-transparent text-lg resize-none outline-none"
                                    />
                                    <div className="text-right text-[var(--color-text-muted)]">{bio.length} / 150</div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-3xl font-semibold" htmlFor="creator-profession">Profession</label>
                                <div className="mt-3">
                                    <input
                                        id="creator-profession"
                                        type="text"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        className="h-12 w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 text-lg outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-input-focus)]"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-3xl font-semibold" htmlFor="creator-phone">Phone number</label>
                                <div className="mt-3">
                                    <input
                                        id="creator-phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 text-lg outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-input-focus)]"
                                    />
                                </div>
                            </div>

                            <p className="mt-8 text-[var(--color-text-muted)]">
                                Certain profile info, such as your name, bio and profession, is visible to everyone.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                                <button
                                    type="submit"
                                    className="mb-4 h-12 w-full rounded-2xl bg-[var(--color-primary)] px-8 text-xl font-semibold text-[var(--color-text-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)] md:min-w-56 md:w-auto"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] text-base font-semibold text-[var(--color-danger)] transition-colors hover:bg-[var(--color-hover)] lg:hidden"
                                >
                                    Logout
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default EditCreatorProfile
