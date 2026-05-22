const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "badge",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate badge unlocks
userBadgeSchema.index(
    { userId: 1, badgeId: 1 },
    { unique: true }
);

const userBadgeModel = mongoose.model("userBadge", userBadgeSchema);

module.exports = userBadgeModel;