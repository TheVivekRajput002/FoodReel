<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="Node 18+" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="License ISC" />
  <img src="https://img.shields.io/badge/PRs-welcome-orange?style=flat-square" alt="PRs Welcome" />
</p>

# 🎬 BrainFood — Learn, Grow & Get Inspired

> **Short-form educational & inspirational content platform — powered by reels, deck cards, and gamified achievements.**

BrainFood is a full-stack web application that educates and inspires people through bite-sized video reels and swipeable deck cards. Creators publish content; users consume, save, and earn badges & points for completing learning milestones.

---

## ✨ Features

### For Users
- 📱 **Vertical Reel Feed** — TikTok/Instagram-style swipeable video reels
- 📚 **Deck Stacks** — Swipeable flashcard decks for micro-learning
- 🏆 **Achievements & Badges** — Earn bronze → silver → gold → platinum badges for reading stacks, watching reels, saving content, following creators, and updating your profile
- 📊 **Score & Streak Tracking** — Gamified progress with cumulative points
- ❤️ **Like & Save** — Bookmark reels to revisit later
- 👤 **Editable Profile** — Custom avatar, bio, and profile picture uploads
- 🔐 **Google OAuth** — One-tap sign-in with Google
- 💬 **Messaging** — Inbox and chat thread UI (coming soon)
- 🔍 **Search** — Discover creators and content (coming soon)

### For Creators
- 🎥 **Reel Upload** — Record or upload short-form video content with thumbnails (via ImageKit CDN)
- 🃏 **Stack Builder** — Create ordered card decks with titles, tags, cover images, and point values
- 📈 **Follower Analytics** — Track follower count and engagement
- 🖼️ **Profile Customization** — Upload profile pictures and manage creator identity

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Vite 8, Tailwind CSS 4, Lucide React |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB ODM) |
| **Database** | MongoDB (local or Atlas) |
| **Auth** | JWT (HTTP-only cookies) + bcrypt + Google OAuth 2.0 |
| **File Storage** | ImageKit (video & image CDN) |
| **Security** | Helmet, CORS allowlist, express-rate-limit, cookie-parser |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | Local instance or [Atlas](https://www.mongodb.com/cloud/atlas) cluster |
| ImageKit | Free account at [imagekit.io](https://imagekit.io) |
| Google OAuth | OAuth 2.0 client from [Google Cloud Console](https://console.cloud.google.com/) *(optional — for Google sign-in)* |

### 1. Clone the repository

```bash
git clone https://github.com/TheVivekRajput002/BrainFood.git
cd brainfood
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

**Backend** — copy and fill `backend/.env.example` → `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

```env
JWT_SECRET=your_random_jwt_secret
MONGODB_URI=mongodb://localhost:27017/brainfood
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** — copy and fill `frontend/.env.example` → `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:3000
```

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend
node server.js
# → Server running on http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → App running on http://localhost:5173
```

**You're up!** Open [http://localhost:5173](http://localhost:5173) in your browser.


---

## 📁 Repository Structure

```
brainfood/
├── backend/
│   ├── server.js                        # Entry point — connects DB & starts Express
│   ├── .env.example                     # Environment variable template
│   └── src/
│       ├── app.js                       # Express app setup, middleware, route mounting
│       ├── db/
│       │   └── db.js                    # MongoDB connection via Mongoose
│       ├── controllers/
│       │   ├── auth.controller.js       # User & Creator register/login/logout
│       │   ├── oauth.controller.js      # Google OAuth redirect & callback
│       │   ├── reel.controller.js       # CRUD reels, like, save, watch tracking
│       │   ├── stack.controller.js      # Create stacks, get stacks, mark as read
│       │   ├── badge.controller.js      # Get badges, complete badge
│       │   ├── user.controller.js       # Update user profile/bio/picture
│       │   └── creator.controller.js    # Creator profile, follow, picture upload
│       ├── middleware/
│       │   └── auth.middleware.js       # JWT verification for User & Creator roles
│       ├── models/
│       │   ├── user.model.js            # User schema (score, streak, profile)
│       │   ├── creator.model.js         # Creator schema (followers, profile)
│       │   ├── reel.model.js            # Reel schema (video, thumbnail, likes)
│       │   ├── stack.model.js           # Stack/deck schema (cards, points, tags)
│       │   ├── card.model.js            # Individual flashcard (head + content)
│       │   ├── badge.model.js           # Achievement badge definitions (tiers)
│       │   ├── userBadge.model.js       # User ↔ Badge completion records
│       │   ├── likes.model.js           # User ↔ Reel like junction
│       │   ├── savedReel.model.js       # User ↔ Reel bookmark junction
│       │   ├── follow.model.js          # User ↔ Creator follow junction
│       │   ├── stackRead.model.js       # Tracks which stacks a user has read
│       │   └── watchedReel.model.js     # Tracks which reels a user has watched
│       ├── routes/
│       │   ├── auth.route.js            # /api/auth/* (register, login, logout, profile)
│       │   ├── oauth.router.js          # /api/auth/google, /auth/callback
│       │   ├── reel.route.js            # /api/reel/* (CRUD, like, save, watch)
│       │   ├── stack.route.js           # /api/stack/* (create, list, detail, read)
│       │   ├── badge.route.js           # /api/badge/* (list, complete)
│       │   ├── user.route.js            # /api/user/* (profile picture, bio)
│       │   └── creator.route.js         # /api/creator/* (follow, profile, picture)
│       └── services/
│           ├── achievement.service.js   # Badge award logic & event checking
│           ├── achievementConditions.service.js  # Event count resolvers
│           └── storage.service.js       # ImageKit upload helper
│
├── frontend/
│   ├── index.html                       # Vite entry HTML
│   ├── vite.config.js                   # Vite + React plugin config
│   ├── vercel.json                      # SPA rewrite rules for Vercel
│   ├── .env.example                     # Frontend env template
│   └── src/
│       ├── main.jsx                     # React DOM root
│       ├── App.jsx                      # Root component
│       ├── App.css                      # Global design tokens & base styles
│       ├── routes/
│       │   └── AppRoutes.jsx            # All route definitions (public + protected)
│       ├── components/
│       │   ├── Layout.jsx               # Page shell (TopBar + BottomNav + Outlet)
│       │   ├── ProtectedRoute.jsx       # Auth guard wrapper
│       │   ├── TopBar.jsx               # App header
│       │   ├── BottomNav.jsx            # Mobile bottom navigation
│       │   ├── DesktopSidebar.jsx       # Desktop sidebar navigation
│       │   ├── HomeReels.jsx            # Vertical reel feed player
│       │   ├── StackHead.jsx            # Stack card preview component
│       │   ├── CreateQuickActions.jsx   # FAB for creating reels/stacks
│       │   ├── Avatar.jsx               # User avatar with status ring
│       │   ├── Button.jsx               # Reusable button component
│       │   ├── InputField.jsx           # Form input with label & error
│       │   ├── Toast.jsx                # Toast notification component
│       │   ├── ConversationRow.jsx      # Messaging inbox row
│       │   └── MessageBubble.jsx        # Chat message bubble
│       ├── pages/
│       │   ├── Home.jsx                 # Main reel feed
│       │   ├── Search.jsx               # Search/discover page
│       │   ├── Saved.jsx                # Saved/bookmarked reels
│       │   ├── Achievements.jsx         # Badges & score dashboard
│       │   ├── user/                    # UserLogin, UserRegister, UserProfile, EditUserProfile
│       │   ├── creator/                 # CreatorLogin, CreatorRegister, CreatorProfile, EditCreatorProfile, CreatorReels
│       │   ├── reel/                    # CreateReel
│       │   ├── stack/                   # StackScroll, StackDetail, StackCreate
│       │   └── Messaging/              # Inbox, ChatThread
│       ├── context/
│       │   └── ToastContext.jsx         # Global toast notification provider
│       ├── hooks/
│       │   └── useMockData.js           # Static data loading hook
│       ├── mock/                        # Mock JSON data for messaging
│       ├── utils/                       # Utility functions
│       ├── styles/                      # Additional stylesheets
│       └── assets/                      # Static images & icons
│
└── README.md                             
```

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                      CLIENT                          │
│         React 19 + Vite + Tailwind CSS 4             │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌───────────┐  │
│  │ Reels  │  │ Stacks │  │ Badges │  │  Profile   │  │
│  │ Feed   │  │ Decks  │  │ Board  │  │  Editor    │  │
│  └───┬────┘  └───┬────┘  └───┬────┘  └─────┬─────┘  │
│      │           │           │              │        │
│      └───────────┴───────────┴──────────────┘        │
│                          │                           │
│                    Axios (HTTP)                       │
│                   JWT Cookie Auth                     │
└──────────────────────┬───────────────────────────────┘
                       │  HTTPS
┌──────────────────────▼───────────────────────────────┐
│                      SERVER                          │
│              Express 5 + Node.js                     │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Middleware: Helmet │ CORS │ Rate Limit │ JWT   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │   Auth   │ │   Reel   │ │  Stack   │ │ Badge  │  │
│  │ Routes   │ │ Routes   │ │ Routes   │ │ Routes │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│       └─────────────┴────────────┴───────────┘       │
│                      │                               │
│            Controllers + Services                    │
│         (Achievement engine, Storage)                │
└──────────────────────┬───────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   ┌─────────────┐          ┌─────────────┐
   │   MongoDB   │          │  ImageKit   │
   │  (Mongoose) │          │   (CDN)     │
   │             │          │             │
   │ Users       │          │ Videos      │
   │ Creators    │          │ Thumbnails  │
   │ Reels       │          │ Avatars     │
   │ Stacks/Cards│          │             │
   │ Badges      │          │             │
   └─────────────┘          └─────────────┘
```

**Key design decisions:**
- **Cookie-based JWT auth** — Tokens stored in HTTP-only, secure, SameSite=None cookies for cross-origin deployment safety
- **Dual role system** — Separate `User` and `Creator` models with independent auth middleware, allowing clean permission boundaries
- **Event-driven achievements** — Every user action (watch reel, read stack, follow creator, etc.) triggers `checkAchievements()` which auto-awards qualifying badges and increments score
- **ImageKit CDN** — All media (videos, thumbnails, profile pictures) uploaded to ImageKit for optimized delivery

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/user/register` | — | Register a new user (name, username, email, password) |
| `POST` | `/api/auth/user/login` | — | Login user, sets JWT cookie |
| `GET` | `/api/auth/user/logout` | — | Clear user auth cookie |
| `GET` | `/api/auth/user/profile` | 🔒 User | Get authenticated user's profile |
| `POST` | `/api/auth/creator/register` | — | Register a new creator |
| `POST` | `/api/auth/creator/login` | — | Login creator, sets JWT cookie |
| `GET` | `/api/auth/creator/logout` | — | Clear creator auth cookie |
| `GET` | `/api/auth/creator/profile` | 🔒 Creator | Get authenticated creator's profile |

### Google OAuth (`/api/auth` & `/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/auth/google` | — | Redirect to Google consent screen |
| `GET` | `/api/auth/google/callback` | — | Google OAuth callback handler |
| `GET` | `/auth/callback` | — | Legacy OAuth callback (matches `GOOGLE_REDIRECT_URI`) |

### Reels (`/api/reel`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reel` | 🔒 Creator | Upload a new reel (`multipart/form-data`, field: `video`) |
| `GET` | `/api/reel` | 🔒 User | Get reel feed |
| `POST` | `/api/reel/like` | 🔒 User | Like/unlike a reel (`{ reelId }`) |
| `POST` | `/api/reel/:reelId/save` | 🔒 User | Save/unsave (bookmark) a reel |
| `POST` | `/api/reel/:reelId/watch` | 🔒 User | Mark reel as watched (triggers achievement check) |
| `GET` | `/api/reel/savedReels` | 🔒 User | Get user's saved/bookmarked reels |

### Stacks / Decks (`/api/stack`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/stack/create` | 🔒 Creator | Create a new stack with ordered cards |
| `GET` | `/api/stack` | — | Get all stacks |
| `GET` | `/api/stack/:id` | — | Get stack detail with cards |
| `POST` | `/api/stack/:id/read` | 🔒 User | Mark stack as read (triggers achievement check) |

### Badges (`/api/badge`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/badge` | 🔒 User | Get all badges with user's completion status |
| `POST` | `/api/badge/:id/completeBadge` | 🔒 User | Manually trigger badge completion check |

### User Profile (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/user/profile-picture` | 🔒 User | Upload profile picture (`multipart/form-data`, field: `image`) |
| `POST` | `/api/user/bio` | 🔒 User | Update user bio text |

### Creator Profile (`/api/creator`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/creator/:id/follow` | 🔒 User | Follow/unfollow a creator |
| `GET` | `/api/creator/profile` | 🔒 Creator | Get creator's own profile |
| `POST` | `/api/creator/profile-picture` | 🔒 Creator | Upload creator profile picture |

---

### Example Request / Response

**Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vivek Rajput",
    "username": "vivek02",
    "email": "vivek@example.com",
    "password": "SecurePass123"
  }'
```

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "name": "Vivek Rajput",
    "username": "vivek02",
    "email": "vivek@example.com",
    "score": 0,
    "streak": 0
  }
}
```


---

## 🚢 Deployment

| Service | Platform | Config |
|---------|----------|--------|
| **Frontend** | [Vercel](https://vercel.com) | Set root directory to `frontend`, add `VITE_API_URL` env var, uses `vercel.json` for SPA rewrites |
| **Backend** | [Render](https://render.com)  | Set all backend env vars, start command: `node server.js` |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Free M0 cluster, whitelist server IP |
| **Media CDN** | [ImageKit](https://imagekit.io) | Free tier covers 20GB bandwidth/month |

### Production Environment Variables

When deploying, update these values from their `localhost` defaults:

```env
# Backend (Render/Railway)
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/callback
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Frontend (Vercel)
VITE_API_URL=https://your-backend.onrender.com
```

> **Vercel 404 fix:** The included `frontend/vercel.json` rewrites all routes to `index.html` for client-side routing. If you still see 404s, ensure the Vercel project root directory is set to `frontend`.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Use **Tailwind CSS** with color variables from `App.css`
- Use **lucide-react** for all icons
- Keep code readable and maintainable
- Follow existing patterns for consistency
- Run `npm run lint` in `frontend/` before submitting PRs

---

## 📄 License

This project is licensed under the **ISC License** — see the backend `package.json` for details.

---

<p align="center">
  <b>Built with ❤️ by <a href="https://github.com/TheVivekRajput002">Vivek Rajput</a></b>
  <br />
  <sub>Star ⭐ this repo if you find it useful!</sub>
</p>
