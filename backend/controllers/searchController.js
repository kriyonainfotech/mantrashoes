const Product = require('../models/Product');
const Category = require('../models/Category');

exports.globalSearch = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) {
            return res.status(200).json({ products: [], categories: [] });
        }

        const regex = new RegExp(query, 'i');

        const categories = await Category.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex }
            ]
        }).select('_id name slug').limit(5);

        const products = await Product.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex },
                { tags: regex },
                { brand: regex }
            ]
        }).populate('category', 'name slug').select('_id name slug price mrp images category').limit(5);

        res.status(200).json({
            categories,
            products,
        });

    } catch (error) {
        console.error("Search API Error: ", error);
        res.status(500).json({ message: "Server error during search" });
    }
};
