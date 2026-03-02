import { useState, useEffect } from 'react';
import axios from "axios"
import { useParams } from 'react-router-dom';

export default function FoodPartnerProfile() {


    const { id } = useParams()

    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                console.log(response.data.foodPartner)
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
            .catch(err => {
                console.log("here is error in fecthing food partner", err)
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
        return <h1>Loading profile...</h1>;
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 border-b border-gray-200 dark:border-gray-700 items-start md:items-start flex-wrap">
                        {/* Avatar Section */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Business" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-white text-5xl flex items-center justify-center">
                                        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-sans text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-200 dark:focus:ring-orange-900 dark:bg-gray-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address || ''}
                                        onChange={handleInputChange}
                                        placeholder="Address"
                                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-sans text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-200 dark:focus:ring-orange-900 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            ) : (
                                <div>

                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{profile.name}</h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                                            <span>📍</span>
                                            {profile?.address || "Nil"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex items-center justify-center gap-12 md:gap-24 py-8 px-8 bg-gradient-to-r from-orange-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1 tracking-tight">
                                {profile?.totalMeals}
                            </div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                Total Meals
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-gray-200 dark:bg-gray-600"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1 tracking-tight">
                                {(profile?.customerServed / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                Customers Served
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0 tracking-tight"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all border border-gray-300 dark:border-gray-600"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0 tracking-tight"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Videos Grid Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8 md:p-10">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Recent Videos</h3>
                        {/* <button
                            title="Add video"
                            className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14"></path>
                            </svg>
                        </button> */}
                    </div>

                    {/* Videos Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {videos.map(v => (
                            <div
                                key={v.id}
                                className="group relative rounded-sm overflow-hidden  border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-zinc-500"
                            >
                                {/* Video Placeholder */}
                                <video src={v.video} muted></video>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
