import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

function EditProfile() {
    const [user, setUser] = useState(null)
    const [gender, setGender] = useState('Male')
    const [suggestionsEnabled, setSuggestionsEnabled] = useState(false)
    const [profilePreview, setProfilePreview] = useState('')
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [bio, setBio] = useState('new user')
    const fileInputRef = useRef(null)

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/auth/user/profile`, { withCredentials: true })
            .then((response) => {
                setUser(response.data.user)
                setBio(response.data.user?.bio ?? 'new user')
            })
            .catch(() => {
                setUser(null)
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
            formData.append("image", file)

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/profile-picture`,
                formData,
                { withCredentials: true }
            )
            setUser((prev) =>
                prev ? { ...prev, profile_picture: response.data.profile_picture } : prev
            )
        } catch (error) {
            console.error("Profile picture upload failed:", error.response?.data || error.message)
        } finally {
            setIsUploadingPhoto(false)
        }
    }

    const handleSubmit = async () => {

        await axios
            .post(`${import.meta.env.VITE_API_URL}/api/user/bio`, { bio }, { withCredentials: true })




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
                            <button className="w-full h-12 rounded-xl bg-[var(--color-hover)] text-left px-4 font-semibold">Edit Profile</button>
                            <button className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Notifications</button>
                        </div>

                        <div className="mt-7 space-y-2">
                            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Who can see your content</h3>
                            <button className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Account privacy</button>
                           
                            <button className="w-full h-12 rounded-xl text-left px-4 font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] transition-colors">Blocked</button>
                        </div>
                    </aside>

                    <section className="w-full max-w-[760px]">
                        <form action="">

                            <h1 className="text-4xl font-bold mb-7">Edit Profile</h1>

                            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 rounded-full bg-[var(--gradient-brand)] p-[2px]">
                                        <div className="h-full w-full rounded-full bg-[var(--color-bg)] flex items-center justify-center text-lg font-bold text-[var(--color-text-on-primary)]">
                                            {profilePreview ? (
                                                <img
                                                    src={profilePreview}
                                                    alt="Profile preview"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : user?.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt="Profile"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                user?.name?.charAt(0).toUpperCase() || 'U'
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold leading-tight">{user?.username || 'username'}</p>
                                        <p className="text-[var(--color-text-secondary)] text-lg">{user?.name || 'Name'}</p>
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
                                    className="h-10 px-5 rounded-xl bg-[var(--color-primary)] text-[var(--color-text-on-primary)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                                >
                                    {isUploadingPhoto ? "Uploading..." : "Change photo"}
                                </button>
                            </div>



                            <div className="mt-8">
                                <label className="text-3xl font-semibold">Bio</label>
                                <div className="mt-3 rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] p-4">
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        maxLength={150}
                                        className="w-full h-24 bg-transparent text-lg resize-none outline-none"
                                    />
                                    <div className="text-right text-[var(--color-text-muted)]">{bio.length} / 150</div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-3xl font-semibold">Gender</label>
                                <div className="mt-3 relative">
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="h-12 w-full rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-input-focus)]"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">⌄</span>
                                </div>
                                <p className="mt-2 text-[var(--color-text-muted)]">This will not be part of your public profile.</p>
                            </div>



                            <p className="mt-8 text-[var(--color-text-muted)]">
                                Certain profile info, such as your name, bio and links, is visible to everyone.
                            </p>

                            <div className="mt-8 flex justify-end">
                                <button 
                                className="h-12 min-w-56 px-8 rounded-2xl bg-[var(--color-primary)] text-[var(--color-text-on-primary)] text-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                                onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
