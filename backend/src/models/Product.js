const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        image: String,
        description: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);