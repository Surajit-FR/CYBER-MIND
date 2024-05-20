const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    full_name: { type: String, required: true },
    profile_img: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    city_state: { type: String, default: "" },
    password: { type: String, required: true },
    type: { type: String, required: true }, // for initial users. It will be changed dynamically if more user types are added.
    is_online: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
    socketId: { type: String, default: "" }, // Socket ID of the user
    family: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);