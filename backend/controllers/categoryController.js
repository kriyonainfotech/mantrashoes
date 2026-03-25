const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description, parent, isActive, showInNavbar, showOnHome, navbarIndex } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: "Name and Slug are required" });
        }

        const categoryData = { 
            name, 
            slug, 
            description,
            isActive: isActive !== undefined ? isActive : true,
            showInNavbar: showInNavbar !== undefined ? showInNavbar : false,
            showOnHome: showOnHome !== undefined ? showOnHome : false,
            navbarIndex: navbarIndex !== undefined ? navbarIndex : 0
        };
        if (parent) categoryData.parent = parent;

        const category = await Category.create(categoryData);

        return res.status(201).json({
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
        const categories = await Category.find().populate("parent", "name").sort({ navbarIndex: 1, createdAt: 1 });
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
        const category = await Category.findById(req.params.id).populate("parent", "name");
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
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

exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug }).populate("parent", "name");
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (err) {
        console.log(err, "[Error] Get category by slug..");
        return res.status(500).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, slug, description, parent, isActive, showInNavbar, showOnHome, navbarIndex } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description !== undefined ? description : category.description;
        category.parent = parent !== undefined ? (parent || null) : category.parent;
        category.isActive = isActive !== undefined ? isActive : category.isActive;
        category.showInNavbar = showInNavbar !== undefined ? showInNavbar : category.showInNavbar;
        category.showOnHome = showOnHome !== undefined ? showOnHome : category.showOnHome;
        category.navbarIndex = navbarIndex !== undefined ? navbarIndex : category.navbarIndex;

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
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
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
