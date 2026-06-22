const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        slug: String,

        description: {
            type: String,
        },

        price: {
            type: Number,
            required: true
        },
        mrp: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        brand: {
            type: String,
        },

        images: [
            {
                url: String,
                public_id: String,
                index: Number
            }
        ],

        colorMap: [
            {
                name: String,
                hex: String,
                image: {
                    url: String,
                    public_id: String
                }
            }
        ],

        variants: [
            {
                size: {
                    type: Number,
                },
                color: {
                    type: String,
                },
                stock: {
                    type: Number,
                },
                sku: {
                    type: String,
                }
            }
        ],

        material: {
            type: String,
        },
        soleMaterial: {
            type: String,
        },
        tags: [String],

        isFeatured: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema);