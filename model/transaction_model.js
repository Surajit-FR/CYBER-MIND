const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    tnx_amout: { type: Number, require: true },
    category: { type: String, require: true },
    note: { type: String, default: "" },
    date_time: { type: Number, require: true },
    tnx_type: { type: String, require: true },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('transaction', TransactionSchema);