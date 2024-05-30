const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    chat: [{ type: Schema.Types.ObjectId, required: true, ref: 'message' }],
}, { timestamps: true });

module.exports = mongoose.model('conversation', ConversationSchema);