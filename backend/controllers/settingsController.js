const Setting = require("../models/Setting");

exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.getSettings();
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await Setting.getSettings();
        
        // Update fields provided in req.body
        const updateData = req.body;
        
        // Handle nested socialLinks if provided
        if (updateData.socialLinks) {
            settings.socialLinks = { ...settings.socialLinks, ...updateData.socialLinks };
            delete updateData.socialLinks;
        }

        Object.assign(settings, updateData);
        await settings.save();
        
        res.json({ success: true, message: "Settings updated successfully", settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
