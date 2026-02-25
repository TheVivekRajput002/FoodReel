import React, { useState } from 'react'

function HomeReels() {
    // Mock data - replace with actual video data from backend
    const [reels] = useState([
        {
            id: 1,
            video: 'https://via.placeholder.com/400x800?text=Video+1',
            description: 'Delicious margherita pizza from our premium kitchen',
            storeName: 'Pizza Palace'
        },
        {
            id: 2,
            video: 'https://via.placeholder.com/400x800?text=Video+2',
            description: 'Fresh sushi rolls made to order with premium ingredients',
            storeName: 'Sushi House'
        },
        {
            id: 3,
            video: 'https://via.placeholder.com/400x800?text=Video+3',
            description: 'Authentic biryanis cooked in traditional methods',
            storeName: 'Biryani Corner'
        }
    ])

    return (
        <div className="h-[90vh] snap-y snap-mandatory overflow-y-scroll bg-black">
            {reels.map(reel => (
                <div key={reel.id} className="h-full w-full snap-center snap-always relative flex items-center justify-center bg-gray-900">
                    {/* Video Background */}
                    <div className="absolute inset-0">
                        <img 
                            src={reel.video} 
                            alt={reel.storeName}
                            className="w-full h-full object-cover"
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
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                            Visit Store
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeReels
