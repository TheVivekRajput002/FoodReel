import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import HomeReels from '../components/HomeReels'
import './Home.css'

function Home() {
    return (
        <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)' }}>

            {/* ── Navbar ──────────────────────────────────────────── */}
            <nav className="home-navbar">
                <div className="home-navbar__inner">

                    {/* Brand */}
                    <Link to="/" className="home-navbar__brand">
                        <span className="home-navbar__logo">🍽</span>
                        <span className="home-navbar__brand-name">SCS Food</span>
                    </Link>

                    {/* Nav links */}
                    <div className="home-navbar__links">
                        <Link to="/user/login" className="home-navbar__link">
                            Sign In
                        </Link>
                        <Link to="/user/register" className="home-navbar__link home-navbar__link--cta">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Page content (hero / child routes) ───────────────── */}
            <main className="home-main">
                <Outlet />

                {/* Reels Feed */}
                <HomeReels />
            </main>
        </div>
    )
}

export default Home
