import React from 'react'
import { Link, Outlet } from 'react-router-dom'
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

                {/* Hero shown only on "/" itself */}
                <div className="home-hero">
                    <h1 className="home-hero__title">
                        Great food,<br />
                        <span className="home-hero__accent">delivered fast.</span>
                    </h1>
                    <p className="home-hero__sub">
                        Discover hundreds of restaurants near you. Order in minutes.
                    </p>
                    <div className="home-hero__actions">
                        <Link to="/user/register" className="home-hero__btn home-hero__btn--primary">
                            Create an account
                        </Link>
                        <Link to="/user/login" className="home-hero__btn home-hero__btn--ghost">
                            Sign in
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
