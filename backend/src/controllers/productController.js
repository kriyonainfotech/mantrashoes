const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: req.file.path,
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};