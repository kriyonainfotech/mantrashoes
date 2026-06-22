const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "reels",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "webm"],
        transformation: [{ quality: "auto" }],
    }),
});

const videoUpload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

module.exports = videoUpload;
