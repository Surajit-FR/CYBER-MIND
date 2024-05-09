const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: { type: String, required: true },
    cat_image_url: { type: String, required: true },
    color_code: [{ type: String, require: true }],
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('category', CategorySchema);