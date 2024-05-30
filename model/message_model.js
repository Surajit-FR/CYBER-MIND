const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    seen: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('message', MessageSchema);