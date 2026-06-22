const Product = require('../models/Product');
const Category = require('../models/Category');

exports.globalSearch = async (req, res) => {
    try {
        const query = req.query.q || '';
        const words = query.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            return res.status(200).json({ products: [], categories: [] });
        }

        // 1. Build category matching query (any word matches name/description)
        const categoryConditions = words.map(word => {
            const r = new RegExp(word, 'i');
            return {
                $or: [
                    { name: r },
                    { description: r }
                ]
            };
        });

        const categories = await Category.find({
            isActive: true,
            $or: categoryConditions
        }).select('_id name slug').limit(5);

        const matchedCategoryIds = categories.map(c => c._id);

        // Fetch subcategories to include products under them
        const subCategories = await Category.find({
            isActive: true,
            parent: { $in: matchedCategoryIds }
        });
        const allCategoryIds = [...matchedCategoryIds, ...subCategories.map(c => c._id)];

        // 2. Build product matching query (any word matches fields OR matches category ID)
        const productConditions = words.map(word => {
            const r = new RegExp(word, 'i');
            return {
                $or: [
                    { name: r },
                    { description: r },
                    { tags: r },
                    { brand: r }
                ]
            };
        });

        const products = await Product.find({
            isActive: true,
            $or: [
                ...productConditions,
                { category: { $in: allCategoryIds } }
            ]
        })
        .populate('category', 'name slug')
        .select('_id name slug price mrp images category')
        .limit(15);

        res.status(200).json({
            categories,
            products,
        });

    } catch (error) {
        console.error("Search API Error: ", error);
        res.status(500).json({ message: "Server error during search" });
    }
};
