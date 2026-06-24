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
            colorMap,
            variants,
            material,
            soleMaterial,
            whatsapp,
            tags,
            isFeatured,
            isActive
        } = req.body;

        const images = [];
        const colorImagesMap = {};

        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                const imgData = {
                    url: file.path,
                    public_id: file.filename,
                };
                if (file.fieldname === 'images') {
                    images.push(imgData);
                } else if (file.fieldname.startsWith('colorImages_')) {
                    const parts = file.fieldname.split('_');
                    const colorIndex = parts[1];
                    if (!colorImagesMap[colorIndex]) {
                        colorImagesMap[colorIndex] = [];
                    }
                    colorImagesMap[colorIndex].push(imgData);
                }
            });
        }

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

        let parsedColorMap = [];
        if (colorMap) {
            try {
                parsedColorMap = typeof colorMap === 'string' ? JSON.parse(colorMap) : colorMap;
                if (!Array.isArray(parsedColorMap)) parsedColorMap = [];
            } catch (e) {
                console.error('Error parsing colorMap:', e);
                parsedColorMap = [];
            }
        }

        if (parsedColorMap.length === 0) {
            return res.status(400).json({ message: "At least one color must be added to the product." });
        }

        parsedColorMap = parsedColorMap.map((color, idx) => {
            color.images = colorImagesMap[idx] || [];
            return color;
        });

        let parsedTags = [];
        if (tags) {
            try {
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
            colorMap: parsedColorMap,
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
            colorMap,
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

        let parsedColorMap = undefined;
        if (colorMap) {
            try {
                parsedColorMap = typeof colorMap === 'string' ? JSON.parse(colorMap) : colorMap;
                if (!Array.isArray(parsedColorMap)) parsedColorMap = [];
            } catch (e) {
                console.error('Error parsing colorMap:', e);
                parsedColorMap = [];
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

        let existingImages = [];
        if (req.body.existingImages) {
            try {
                existingImages = typeof req.body.existingImages === 'string' ? JSON.parse(req.body.existingImages) : req.body.existingImages;
                if (!Array.isArray(existingImages)) existingImages = [];
            } catch (e) {
                existingImages = [];
            }
        }

        const newImages = [];
        const newColorImagesMap = {};

        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                const imgData = {
                    url: file.path,
                    public_id: file.filename,
                };
                if (file.fieldname === 'images') {
                    newImages.push(imgData);
                } else if (file.fieldname.startsWith('colorImages_')) {
                    const parts = file.fieldname.split('_');
                    const colorIndex = parts[1];
                    if (!newColorImagesMap[colorIndex]) {
                        newColorImagesMap[colorIndex] = [];
                    }
                    newColorImagesMap[colorIndex].push(imgData);
                }
            });
        }

        if (parsedColorMap && parsedColorMap.length > 0) {
            parsedColorMap = parsedColorMap.map((color, idx) => {
                // Ensure color.images is an array
                color.images = Array.isArray(color.images) ? color.images : [];
                // Append any newly uploaded images for this color
                if (newColorImagesMap[idx]) {
                    color.images.push(...newColorImagesMap[idx]);
                }
                return color;
            });
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
            soleMaterial,
            whatsapp,
            isFeatured,
            isActive
        };

        if (parsedColorMap !== undefined) {
            if (parsedColorMap.length === 0) {
                return res.status(400).json({ message: "At least one color must be added to the product." });
            }
            updateData.colorMap = parsedColorMap;
        }
        if (parsedVariants !== undefined) updateData.variants = parsedVariants;
        if (parsedTags !== undefined) updateData.tags = parsedTags;

        // If new images were uploaded, or existingImages were sent, we update the images array
        if (req.files && req.files.length > 0 || req.body.existingImages !== undefined) {
            updateData.images = [...existingImages, ...newImages];
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