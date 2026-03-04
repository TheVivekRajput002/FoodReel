import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function Saved() {
    // Mock saved items — replace with actual saved data from backend/local storage
    const [savedItems, setSavedItems] = useState([
        {
            _id: '1',
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken pieces',
            thumbnail: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=500&fit=crop',
            foodPartner: 'partner1',
            storeName: 'Spice Kitchen',
        },
        {
            _id: '2',
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with fresh mozzarella and basil',
            thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=500&fit=crop',
            foodPartner: 'partner2',
            storeName: 'Pizza Palace',
        },
        {
            _id: '3',
            name: 'Sushi Platter',
            description: 'Fresh assorted sushi rolls with wasabi and ginger',
            thumbnail: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop',
            foodPartner: 'partner3',
            storeName: 'Tokyo Bites',
        },
        {
            _id: '4',
            name: 'Tacos Al Pastor',
            description: 'Authentic Mexican tacos with marinated pork and pineapple',
            thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=500&fit=crop',
            foodPartner: 'partner4',
            storeName: 'El Sabor',
        },
    ])

    const removeSaved = (id) => {
        setSavedItems(prev => prev.filter(item => item._id !== id))
    }

    return (
        <div className="h-[100dvh] w-full bg-black flex flex-col">

            {/* ── Header ──────────────────────────────────────── */}
            <header className="px-5 pt-12 pb-4 shrink-0">
                <h1 className="text-white text-2xl font-bold tracking-tight">Saved</h1>
                <p className="text-white/50 text-sm mt-1">{savedItems.length} items saved</p>
            </header>

            {/* ── Saved Items Grid ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
                {savedItems.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                        </div>
                        <p className="text-white/40 text-base font-medium">No saved items yet</p>
                        <p className="text-white/25 text-sm">Save your favorite food reels to find them here</p>
                        <Link to="/" className="mt-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium py-2.5 px-6 rounded-full border border-white/10 transition-all">
                            Browse Reels
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {savedItems.map(item => (
                            <div
                                key={item._id}
                                className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-[3/4]"
                            >
                                {/* Thumbnail */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                {/* Remove button (top right) */}
                                <button
                                    onClick={() => removeSaved(item._id)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Saved bookmark icon (top left) */}
                                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-white text-sm font-semibold truncate">{item.name}</h3>
                                    <p className="text-white/50 text-[11px] mt-0.5 truncate">{item.storeName}</p>

                                    <Link to={`/food-partner/${item.foodPartner}`}>
                                        <button className="mt-2 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium py-1.5 rounded-lg border border-white/15 transition-all active:scale-95">
                                            visit store
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Bottom Navbar ─────────────────────────────────── */}
            <BottomNav />
        </div>
    )
}

export default Saved
