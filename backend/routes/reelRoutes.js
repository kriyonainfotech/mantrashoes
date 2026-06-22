const express = require("express");
const router = express.Router();
const { getReels, getAllReels, createReel, updateReel, deleteReel } = require("../controllers/reelController");
const videoUpload = require("../middleware/videoUploadMiddleware");

router.get("/", getReels);                                    // public
router.get("/all", getAllReels);                     // admin
router.post("/", videoUpload.single("video"), createReel);  // upload video
router.put("/:id", updateReel);                     // update meta only
router.delete("/:id", deleteReel);

module.exports = router;
