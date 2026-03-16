const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = await Category.create({ name });

        if (!category) {
            return res.status(400).json({ message: "Category not created" });
        }

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (err) {
        console.log(err, "[Error] Create category..");
        return res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (err) {
        console.log(err, "[Error] Get categories..");
        return res.status(500).json({ message: err.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (err) {
        console.log(err, "[Error] Get category..");
        return res.status(500).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        console.log(req.params.id, "[Update category]");
        const { name } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }

        category.name = name;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (err) {
        console.log(err, "[Error] Update category..");
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        console.log(req.params.id, "[Delete category]");

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category
        });
    } catch (err) {
        console.log(err, "[Error] Delete category..");
        return res.status(500).json({ message: err.message });
    }
};
