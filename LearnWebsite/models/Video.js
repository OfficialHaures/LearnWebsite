const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    filename: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
