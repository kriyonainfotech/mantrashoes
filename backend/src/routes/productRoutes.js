const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("image"), createProduct);

module.exports = router;