const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
    url: { type: String, required: true }, // e.g. https://www.instagram.com/reel/ABC123/
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("InstagramReel", reelSchema);
