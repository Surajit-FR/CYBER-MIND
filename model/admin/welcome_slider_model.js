const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WelcomeSliderSchema = new Schema({
    heading: { type: String, require: true },
    para: { type: String, require: true },
    scr_img: { type: String, require: true },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('welcome_slider', WelcomeSliderSchema);