const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    try {

        const {
            name,
            slug,
            description,
            price,
            mrp,
            discount,
            category,
            brand,
            variants,
            material,
            soleMaterial,
            whatsapp,
            tags,
            isFeatured,
            isActive
        } = req.body;

        const images = req.files ? req.files.map((file, index) => ({
            url: file.path,
            public_id: file.filename,
            index: index
        })) : [];

        let parsedVariants = [];
        if (variants) {
            try {
                parsedVariants = typeof variants === 'string' && variants !== "[object Object]" ? JSON.parse(variants) : variants;
                if (!Array.isArray(parsedVariants)) parsedVariants = [];
            } catch (e) {
                console.error("Error parsing variants:", e);
                parsedVariants = [];
            }
        }

        let parsedTags = [];
        if (tags) {
            try {
                // If it looks like a JSON array, parse it. Otherwise, handle as string or array.
                parsedTags = typeof tags === 'string' && tags.trim().startsWith('[') 
                    ? JSON.parse(tags) 
                    : (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t));
            } catch (e) {
                parsedTags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }

        const product = await Product.create({
            name,
            slug,
            description,
            price,
            mrp,
            discount,
            category,
            brand,
            images,
            variants: parsedVariants,
            material,
            soleMaterial,
            whatsapp,
            tags: parsedTags,
            isFeatured,
            isActive
        });

        res.status(201).json(product);

    } catch (error) {
        console.log(error, "error mesage");
        res.status(500).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {

        const products = await Product
            .find()
            .populate("category")
            .sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {

        const product = await Product
            .findById(req.params.id)
            .populate("category");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {

        const {
            name,
            slug,
            description,
            price,
            mrp,
            discount,
            category,
            brand,
            variants,
            soleMaterial,
            whatsapp,
            tags,
            isFeatured,
            isActive
        } = req.body;

        let parsedVariants = undefined;
        if (variants) {
            try {
                parsedVariants = typeof variants === 'string' && variants !== "[object Object]" ? JSON.parse(variants) : variants;
                if (!Array.isArray(parsedVariants)) parsedVariants = [];
            } catch (e) {
                console.error("Error parsing variants in update:", e);
                parsedVariants = [];
            }
        }

        let parsedTags = undefined;
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' && tags.trim().startsWith('[') 
                    ? JSON.parse(tags) 
                    : (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t));
            } catch (e) {
                parsedTags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }

        const updateData = {
            name,
            slug,
            description,
            price,
            mrp,
            discount,
            category,
            brand,
            variants: parsedVariants,
            soleMaterial,
            whatsapp,
            tags: parsedTags,
            isFeatured,
            isActive
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file, index) => ({
                url: file.path,
                public_id: file.filename,
                index: index
            }));
        }

        // Clean up undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};