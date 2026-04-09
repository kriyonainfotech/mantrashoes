const express = require("express");
const router = express.Router();
const uploadSettings = require("../middleware/settingsUploadMiddleware");
const settingsController = require("../controllers/settingsController");

// Get settings
router.get("/", settingsController.getSettings);

// Update settings
router.put("/", settingsController.updateSettings);

// Upload a single image for settings (hero, brand story, instagram gallery etc.)
// Field name: "image"
router.post("/upload-image", uploadSettings.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }
        res.json({
            success: true,
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        console.error("Settings upload error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
