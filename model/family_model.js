const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
    family_name: { type: String, required: true },
    family_hash_id: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('family', FamilySchema);