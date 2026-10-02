const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    whatsappNumber: { type: String, default: "" },
    // We can add more global settings here later
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    socialLinks: {
        instagram: { type: String, default: "" },
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
    },
    uiSettings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Ensure only one setting document exists
settingSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model("Setting", settingSchema);
