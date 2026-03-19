const express = require("express");
const router = express.Router();

// Routes
router.use("/products", require("./productRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/auth", require("./authRoutes"));
router.use("/reels", require("./reelRoutes"));

module.exports = router;