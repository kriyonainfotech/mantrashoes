const express = require("express");
const router = express.Router();

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.post("/create-category", createCategory);
router.get("/get-categories", getCategories);
router.get("/get-category/:id", getCategory);
router.put("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);

module.exports = router;
