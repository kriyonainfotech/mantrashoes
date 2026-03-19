const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true },      // Cloudinary video URL
    thumbnailUrl: { type: String, default: "" },     // Cloudinary thumbnail (auto-generated)
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Reel", reelSchema);
