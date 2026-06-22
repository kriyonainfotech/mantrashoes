const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


router.post("/create-product", upload.array("images", 5), createProduct);

router.get("/get-products", getProducts);

router.get("/get-product/:id", getProduct);

router.put("/update-product/:id", upload.array("images", 5), updateProduct);

router.delete("/delete-product/:id", deleteProduct);

module.exports = router;