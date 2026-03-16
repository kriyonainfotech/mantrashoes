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
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        brand: {
            type: String,
            required: true
        },

        images: [
            {
                url: String,
                public_id: String
            }
        ],

        variants: [
            {
                size: {
                    type: Number,
                    required: true
                },
                color: {
                    type: String,
                    required: true
                },
                stock: {
                    type: Number,
                    required: true
                },
                sku: {
                    type: String,
                    required: true
                }
            }
        ],

        material: {
            type: String,
            required: true
        },
        soleMaterial: {
            type: String,
            required: true
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