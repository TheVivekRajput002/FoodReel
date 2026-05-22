# SCS FoodPlatform

Short-form food discovery platform with role-based auth, food reel uploads, social actions (like/save), and a mobile-first React interface.

## Summary
SCS FoodPlatform is a full-stack app for two user roles:
- `User`: browse reels, like/bookmark content, view profiles.
- `Food Partner`: register/login and publish food reels.

The project is split into:
- `frontend/`: React + Vite + Tailwind client.
- `backend/`: Express + MongoDB API with JWT cookie auth.

## What Problem It Solves
This project provides a focused social food product where creators (food partners) can post short food content and users can discover and engage with it without a complex marketplace flow.

## Quick Demo Flow
1. Register/login as a `food partner`.
2. Create a food reel from `/create-food` (video upload).
3. Login as a `user`.
4. Open `/` feed, then like and bookmark reels.
5. Visit `/food-partner/:id` and `/profile`.

## Tech Stack
- Frontend: React 19, React Router, Vite, Tailwind CSS v4, Axios
- Backend: Node.js, Express 5, Mongoose, JWT, bcrypt, multer, ImageKit
- Security/middleware: Helmet, CORS allowlist, rate limiting, cookie-parser

## Project Structure
```txt
SCS FoodPlatform/
  backend/
    src/
    server.js
    .env.example
  frontend/
    src/
    index.html
```

## Installation
### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- ImageKit account (for video upload)

### 1) Clone and install
```bash
git clone <your-repo-url>
cd "SCS FoodPlatform"

cd backend
npm install

cd ../frontend
npm install
```

## Configuration
### Backend env (`backend/.env`)
Start from `backend/.env.example` and set:

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
FRONTEND_URL=http://localhost:5173
```

Notes:
- `ALLOWED_ORIGINS` supports comma-separated origins.
- Auth cookies are set with `secure: true` and `sameSite: none`, so HTTPS is required in strict browser environments.
- Google sign-in: `GOOGLE_REDIRECT_URI` must exactly match a URI in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth client → **Authorized redirect URIs**. The backend serves the callback at `/auth/callback` (and `/api/auth/callback`).

### Frontend env (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

## Deploy Google OAuth (production)

If Google sign-in redirects to `http://localhost:5173/...?oauth_error=Google+OAuth+is+not+configured`, the **hosted backend** is missing OAuth env vars and/or `FRONTEND_URL`.

### 1) Backend host (Render, Railway, etc.)

Set the same variables as local `.env`, but use production URLs:

| Variable | Example (replace with yours) |
|----------|------------------------------|
| `GOOGLE_CLIENT_ID` | From Google Cloud OAuth client |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud OAuth client |
| `GOOGLE_REDIRECT_URI` | `https://YOUR-BACKEND.onrender.com/auth/callback` |
| `FRONTEND_URL` | `https://food-reel-plum.vercel.app` |
| `ALLOWED_ORIGINS` | `https://food-reel-plum.vercel.app` (comma-separate if you have more) |

Redeploy the backend after saving env vars.

### 2) Google Cloud Console

Under your OAuth 2.0 client:

- **Authorized redirect URIs**: add `https://YOUR-BACKEND.onrender.com/auth/callback` (must match `GOOGLE_REDIRECT_URI` exactly).
- **Authorized JavaScript origins** (optional for this flow): your frontend URL, e.g. `https://food-reel-plum.vercel.app`.

Keep `http://localhost:3000/auth/callback` if you still test locally.

### 3) Frontend host (Vercel, etc.)

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` (no trailing slash) |

**Redeploy** the frontend after changing `VITE_API_URL` (Vite bakes it in at build time).

### 4) Quick check

- Google button should open: `https://YOUR-BACKEND/.../api/auth/google` (or `/auth/google` depending on mount).
- On failure, you should land on `https://YOUR-FRONTEND/user/login?oauth_error=...`, not `localhost:5173`.

## Run Locally
### Start backend
```bash
cd backend
node server.js
```

### Start frontend
```bash
cd frontend
npm run dev
```

Frontend default URL is shown by Vite (usually `http://localhost:5173`).

## Scripts
### Frontend (`frontend/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview built app
- `npm run lint` - Run ESLint

### Backend (`backend/package.json`)
- `npm test` - Placeholder script (currently not implemented)

## API Overview
Base URL: `http://localhost:3000`

### Auth (`/api/auth`)
- `POST /user/register`
- `POST /user/login`
- `GET /user/logout`
- `GET /user/profile` (auth required)
- `POST /food-partner/register`
- `POST /food-partner/login`
- `GET /food-partner/logout`

### Food (`/api/food`)
- `POST /` (food-partner auth + `video` file upload)
- `GET /` (user auth)
- `POST /like` (user auth, `{ foodId }`)
- `POST /bookmark` (user auth, `{ foodId }`)

### Food Partner (`/api/food-partner`)
- `GET /:id` (user auth)

## Frontend Routes
Public:
- `/user/register`
- `/user/login`
- `/food-partner/register`
- `/food-partner/login`

Protected:
- `/`
- `/search`
- `/saved`
- `/messages`
- `/messages/:conversationId`
- `/food-partner/:id`
- `/profile`
- `/create-food`

## Caveats and Limitations
- Essential messaging screens currently use mock data in `frontend/src/mock/messages.json`.
- Backend has no production-ready test suite yet.
- Cookies configured for cross-site secure mode may require HTTPS/local proxy adjustments during development.

## Contributing
1. Create a feature branch.
2. Keep changes scoped and documented.
3. Run frontend lint before PR.

## License
Current backend `package.json` specifies `ISC` license. If you want a different license for the full monorepo, update this section and add a root `LICENSE` file.
