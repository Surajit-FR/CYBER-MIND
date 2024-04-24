const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    family: { type: Schema.Types.ObjectId, ref: 'family', required: true },
    role: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('member', MembershipSchema);
