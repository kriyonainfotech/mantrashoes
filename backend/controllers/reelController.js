const Reel = require("../models/Reel");
const cloudinary = require("../config/cloudinary");

// GET /api/reels — public, active reels sorted by order
exports.getReels = async (req, res) => {
    try {
        const reels = await Reel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, reels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/reels/all — admin, all reels
exports.getAllReels = async (req, res) => {
    try {
        const reels = await Reel.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, reels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/reels — upload video
exports.createReel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Video file is required" });

        const videoUrl = req.file.path; // Cloudinary URL
        const publicId = req.file.filename; // Cloudinary public_id

        // Auto-generate thumbnail from video (first frame)
        const thumbnailUrl = cloudinary.url(publicId, {
            resource_type: "video",
            format: "jpg",
            transformation: [{ start_offset: "0" }],
        });

        // Auto-assign order if not provided
        const { caption, order } = req.body;
        let reelOrder = order !== undefined && order !== "" ? Number(order) : null;
        if (reelOrder === null) {
            const count = await Reel.countDocuments();
            reelOrder = count; // 0-indexed, so next in line
        }

        const reel = await Reel.create({ videoUrl, thumbnailUrl, caption: caption || "", order: reelOrder });
        res.status(201).json({ success: true, reel });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/reels/:id — update caption/order/isActive (no re-upload)
exports.updateReel = async (req, res) => {
    try {
        const { caption, order, isActive } = req.body;
        const reel = await Reel.findByIdAndUpdate(
            req.params.id,
            { caption, order, isActive },
            { new: true }
        );
        if (!reel) return res.status(404).json({ message: "Reel not found" });
        res.json({ success: true, reel });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/reels/:id — delete from DB + Cloudinary
exports.deleteReel = async (req, res) => {
    try {
        const reel = await Reel.findByIdAndDelete(req.params.id);
        if (!reel) return res.status(404).json({ message: "Reel not found" });

        // Extract public_id from Cloudinary URL and delete
        try {
            const parts = reel.videoUrl.split("/");
            const fileWithExt = parts[parts.length - 1];
            const publicId = "reels/" + fileWithExt.split(".")[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        } catch (_) { /* non-fatal */ }

        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
