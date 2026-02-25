import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

function HomeReels() {
    // Mock data - replace with actual video data from backend
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/", { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems)
                // console.log(response.data.foodItems)
            })
    }, [])


    return (
        <div className="h-[90vh] snap-y snap-mandatory overflow-y-scroll bg-black ">
            {videos.map(reel => (
                <div key={reel._id} className="h-full w-full snap-center snap-always relative flex items-center justify-center bg-gray-900">
                    {/* Video Background */}
                    <div className="absolute inset-0">
                        <video
                            src={reel.video}
                            alt={reel.name}
                            className="w-full h-full object-cover md:object-contain object-center"
                            autoPlay
                            loop
                            muted
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>

                    {/* Content overlay - bottom area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
                        {/* Description - truncated to 2 lines */}
                        <p className="text-white text-sm mb-3 line-clamp-2">
                            {reel.description}
                        </p>

                        {/* Visit Store Button */}
                        <Link to={`/food-partner/${reel.foodPartner}`}
                        >
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                                Visit Store
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeReels
