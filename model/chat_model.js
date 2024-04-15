const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    sender_id: { type: Schema.Types.ObjectId, require: true, ref: 'user' },
    receiver_id: { type: Schema.Types.ObjectId, require: true, ref: 'user' },
    event_name: { type: String, require: true },
}, { timestamps: true });

module.exports = mongoose.model('chat', ChatSchema);