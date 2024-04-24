const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'family', required: true },
    role: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('member', MembershipSchema);
