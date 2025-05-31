const mongoose = require('../config/db');

const confirmationTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date,  default: () => Date.now() + 1000 * 60 * 60 }, // 1 hour from now
});

module.exports = mongoose.model('ConfirmationToken', confirmationTokenSchema);