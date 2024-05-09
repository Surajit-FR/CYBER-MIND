const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionCategorySchema = new Schema({
    transaction_category_name: { type: String, required: true },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('transaction_category', TransactionCategorySchema);