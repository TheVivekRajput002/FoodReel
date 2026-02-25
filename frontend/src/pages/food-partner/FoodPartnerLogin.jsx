import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"


function FoodPartnerLogin() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {

            const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
                email,
                password
            }, {
                withCredentials: true
            })

            console.log(response.data)
            navigate("/create-food")

        } catch (error) {
            console.log("err in foodpartnerlogin handlesubmit", error)
        }

    }

    return (
        <div
            className="min-h-dvh flex items-center justify-center p-6"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="auth-card p-8">

                    {/* Badge */}
                    <div className="mb-4">
                        <span className="auth-badge">Food Partner</span>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-2xl font-semibold tracking-tight mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        Partner sign in
                    </h1>
                    <p className="text-sm mb-7" style={{ color: 'var(--color-text-secondary)' }}>
                        Access your restaurant dashboard.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>

                        {/* Business email */}
                        <div>
                            <label htmlFor="business-email" className="auth-label">Business email</label>
                            <input id="business-email" type="email" name="email" placeholder="orders@yourrestaurant.com" className="auth-input" autoComplete="email" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                            </div>
                            <input id="password" name='password' type="password" placeholder="Enter your password" className="auth-input" autoComplete="current-password" />
                        </div>



                        <button type="submit" className="auth-btn-primary">Sign in to dashboard</button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Not a partner yet?{' '}
                        <Link to="/food-partner/register" className="auth-link">Apply now</Link>
                    </p>

                    <div className="auth-divider mt-6 mb-5 text-xs">or</div>

                    <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Looking to order food?{' '}
                        <Link to="/user/login" className="auth-link text-xs">Sign in as User</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default FoodPartnerLogin
