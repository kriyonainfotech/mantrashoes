const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "settings",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const uploadSettings = multer({ storage });

module.exports = uploadSettings;
