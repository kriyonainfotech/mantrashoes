const express = require("express");
const router = express.Router();

const { createCategory, getCategories, getCategory, getCategoryBySlug, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.post("/create-category", createCategory);
router.get("/get-categories", getCategories);
router.get("/get-category/:id", getCategory);
router.get("/get-category-by-slug/:slug", getCategoryBySlug);
router.put("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);

module.exports = router;
