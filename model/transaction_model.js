const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    tnx_amout: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String, default: "" },
    date_time: { type: Number, required: true },
    tnx_type: { type: String, required: true },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('transaction', TransactionSchema);