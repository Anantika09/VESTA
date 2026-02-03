const Wardrobe = require('../models/Wardrobe');

exports.uploadToWardrobe = async (req, res) => {
    try {
        const { userId, category, color } = req.body;

        // Check if file exists (provided by Multer)
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided." });
        }

        const newItem = new Wardrobe({
            userId,
            imageUrl: req.file.path, // This is the Cloudinary URL
            category,
            primaryColor: color
        });

        await newItem.save();
        res.status(201).json({ 
            success: true, 
            message: "Item saved to your digital closet!", 
            item: newItem 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWardrobe = async (req, res) => {
    try {
        const { userId, category } = req.query;
        let query = { userId };
        if (category && category !== 'All') query.category = category;

        const items = await Wardrobe.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};