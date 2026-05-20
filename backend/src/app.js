const express = require("express")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const authRoutes = require("./routes/auth.route")
const foodRoutes = require("./routes/food.route")
const foodPartnerRoutes = require("./routes/food-partner.route")
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
    windowMs: 15 * 60 * 1000,  // 15 minute window
    max: 20,                    // max 20 requests per IP in that window
    message: { message: "Too many attempts, try again later" },
    standardHeaders: true,      // sends RateLimit headers in response
    legacyHeaders: false,
});

app.get("/", (req, res) => {
    res.send("hello world" )
})

app.use("/api/auth", authLimiter)
app.use("/api/auth", authRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/food-partner", foodPartnerRoutes)

module.exports = app;

