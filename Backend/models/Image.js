const mongoose = require('../config/db');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    detectedPeopleCount: { type: Number, default: 0 },
    boundingBoxes: [{
        x: Number,
        y: Number,
        width: Number,
        height: Number
    }]
});

module.exports = mongoose.model('Image', imageSchema);