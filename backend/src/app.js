const express = require("express")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const authRoutes = require("./routes/auth.route")
const foodRoutes = require("./routes/food.route")


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("hello world" )
})

app.use("/api/auth", authRoutes)
app.use("/api/food/", foodRoutes)

module.exports = app;

