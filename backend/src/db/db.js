const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("database connected")
    })
    .catch((err) => {
        console.log(" db is not connected", err)
    })
}

module.exports = connectDB;