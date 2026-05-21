import { useState, useEffect } from 'react';
import axios from "axios"
import { useParams } from 'react-router-dom';

export default function creatorProfile() {


    const { id } = useParams()

    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/creator/profile`, { withCredentials: true })
            .then(response => {
                console.log(response.data.creator)
                console.log(response.data.reels)
                setProfile(response.data.creator)
                setVideos(response.data.creator.reels || [])
            })
            .catch(err => {
                console.log("here is error in fetching creator", err)
            })

    }, [id])

    const [isEditing, setIsEditing] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({
                    ...prev,
                    avatar: event.target?.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Save profile to API
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset profile from API or previous state
        setIsEditing(false);
    };

    if (!profile || !videos) {
        return <h1 className="text-[var(--color-text-secondary)] p-6">Loading profile...</h1>;
    }


    return (
        <div className="min-h-screen bg-[var(--color-bg)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-[var(--color-surface)] rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[var(--color-border)] mb-8 overflow-hidden">
                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 border-b border-[var(--color-border)] items-start md:items-start flex-wrap">
                        {/* Avatar Section */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 rounded-full bg-[var(--gradient-brand)] flex items-center justify-center overflow-hidden border-4 border-[var(--color-surface)] shadow-lg hover:scale-105 transition-transform">
                                {profile.profile_picture ? (
                                    <img src={profile.profile_picture} alt="Business" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-[var(--color-text-on-primary)] text-5xl flex items-center justify-center">
                                        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute inset-0 bg-[color:var(--color-backdrop)] flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                        <svg className="w-6 h-6 text-[var(--color-text-on-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14"></path>
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 min-w-64">
                            {isEditing ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="Business Name"
                                        className="px-4 py-3 border-2 border-[var(--color-input-border)] rounded-lg bg-[var(--color-input-bg)] text-[var(--color-text-primary)] font-sans text-base transition-all focus:outline-none focus:border-[var(--color-input-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address || ''}
                                        onChange={handleInputChange}
                                        placeholder="Address"
                                        className="px-4 py-3 border-2 border-[var(--color-input-border)] rounded-lg bg-[var(--color-input-bg)] text-[var(--color-text-primary)] font-sans text-base transition-all focus:outline-none focus:border-[var(--color-input-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                                    />
                                </div>
                            ) : (
                                <div>

                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{profile.name}</h2>
                                        <p className="text-[var(--color-text-secondary)] text-sm flex items-center gap-1">
                                            <span>📍</span>
                                            {profile?.address || "Nil"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex items-center justify-center gap-12 md:gap-24 py-8 px-8 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                        <div className="text-center">
                            <div className="text-3xl font-black text-[var(--color-primary)] mb-1 tracking-tight">
                                {profile?.totalMeals}
                            </div>
                            <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                                Total Meals
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-[var(--color-border)]"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-[var(--color-primary)] mb-1 tracking-tight">
                                {(profile?.customerServed / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                                Customers Served
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-[var(--color-border)]">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] font-semibold rounded-lg transition-all duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0 tracking-tight"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-[var(--color-surface-2)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)] font-semibold rounded-lg transition-all border border-[var(--color-border)]"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-on-primary)] font-semibold rounded-lg transition-all duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0 tracking-tight"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Videos Grid Section */}
                <div className="bg-[var(--color-surface)] rounded-xl shadow-md border border-[var(--color-border)] p-8 md:p-10">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Recent Videos</h3>
                    </div>

                    {/* Videos Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {videos.map(v => (
                            <div
                                key={v._id}
                                className="group relative rounded-sm overflow-hidden border border-[var(--color-border)] cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-[var(--color-surface-2)]"
                            >
                                <img
                                    src={v.thumbnail}
                                    alt={v.name || "Reel thumbnail"}
                                    className="aspect-square h-full w-full object-cover"
                                />

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
