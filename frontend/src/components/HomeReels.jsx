import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

function HomeReels() {
    const [videos, setVideos] = useState([])
    const [liked, setLiked] = useState({})
    const [saved, setSaved] = useState({})

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/", { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems)
            })
    }, [])

    const toggleLike = (id) => {
        setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleSave = (id) => {
        setSaved(prev => ({ ...prev, [id]: !prev[id] }))
    }

    async function likeVideo(reel) {
        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: reel._id }, { withCredentials: true })

        if (response.data.like) {
            console.log("video liked")
            setVideos((prev) => prev.map((v) => v._id === reel._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        } else {
            console.log("video DISliked")
            setVideos((prev) => prev.map((v) => v._id === reel._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }
    
    async function bookmarkVideo(reel){
        const response = await axios.post("http://localhost:3000/api/food/bookmark", {foodId: reel._id}, {withCredentials: true}  )
        
        if(response.data.save){
            console.log("reel bookmarked")
            setVideos((prev) => prev.map((v) => v._id === reel._id ? { ...v, bookmarkCount: v.bookmarkCount + 1 } : v))
        } else {
            console.log("reel unbookmarked")
            setVideos((prev) => prev.map((v) => v._id === reel._id ? { ...v, bookmarkCount: v.bookmarkCount - 1 } : v))

        }
    }

    return (
        <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll bg-black">
            {videos.map(reel => (
                <div
                    key={reel._id}
                    className="h-full w-full snap-center snap-always relative flex items-center justify-center"
                >
                    {/* ── Video Background ────────────────────────── */}
                    <div className="absolute inset-0 rounded-[24px] overflow-hidden m-2 mb-0 border border-white/10">
                        <video
                            src={reel.video}
                            alt={reel.name}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        {/* Subtle dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                    </div>

                    {/* ── Right Side Actions (Like, Save, Comment) ── */}
                    <div className="absolute right-6 bottom-48 flex flex-col items-center gap-5 z-10">
                        {/* Like */}
                        <button
                            onClick={() => { toggleLike(reel._id); likeVideo(reel); }}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-colors ${liked[reel._id] ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={liked[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </div>
                            <span className="text-white/80 text-[11px] font-medium">likes : {reel.likeCount || 0}</span>
                        </button>

                        {/* Save */}
                        <button
                            onClick={() => {toggleSave(reel._id); bookmarkVideo(reel); }}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-colors ${saved[reel._id] ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} fill={saved[reel._id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                            </div>
                            <span className="text-white/80 text-[11px] font-medium">Save : {reel.bookmarkCount || 0}</span>
                        </button>

                        {/* Comment */}
                        <button className="flex flex-col items-center gap-1 group">
                            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                            </div>
                            <span className="text-white/80 text-[11px] font-medium">Comment:{reel.comments || 0}</span>
                        </button>
                    </div>

                    {/* ── Bottom Content (Description + Visit Store) ── */}
                    <div className="absolute bottom-16 left-4 right-20 z-10">
                        {/* Description */}
                        <p className="text-white/90 text-sm font-medium mb-3 line-clamp-2 drop-shadow-lg">
                            {reel.description || 'description'}
                        </p>

                        {/* Visit Store Button */}
                        <Link to={`/food-partner/${reel.foodPartner}`}>
                            <button className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold py-2.5 px-6 rounded-lg border border-white/20 transition-all active:scale-95 text-sm">
                                visit store
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeReels
