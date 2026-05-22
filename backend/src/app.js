const express = require("express")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const authRoutes = require("./routes/auth.route")
const stackRoutes = require("./routes/stack.route")
const userRoutes = require("./routes/user.route")
const reelRoutes = require("./routes/reel.route")
const creatorRoutes = require("./routes/creator.route")
const badgeRoutes = require("./routes/badge.route")
const cors = require("cors")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const app = express()

app.use(
    cors({
        origin: function (origin, callback) {
            const allowed = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
            if (!origin || allowed.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: ${origin}`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 204
    })
);

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,  // 5 minute window
    max: 25,                    // max 20 requests per IP in that window
    message: { message: "Too many attempts, try again later" },
    standardHeaders: true,      // sends RateLimit headers in response
    legacyHeaders: false,
});

app.get("/", (req, res) => {
    res.send("hello world" )
})

app.use("/api/auth", authLimiter)
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/reel", reelRoutes)
app.use("/api/stack", stackRoutes)
app.use("/api/creator", creatorRoutes)
app.use("/api/badge", badgeRoutes)

module.exports = app;

