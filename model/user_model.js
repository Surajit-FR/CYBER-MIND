const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // full_name: { type: String, default: "" },
    username: { type: String, require: true },
    profile_img: { type: String, default: "" },
    email: { type: String, require: true },
    phone: { type: String, default: "" },
    city_state: { type: String, default: "" },
    password: { type: String, require: true },
    type: { type: String, require: true }, // for initial users. It will be changed dynamically if more user type added.
    is_online: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
    socketId: { type: String, default: "" } // Socket ID of the user
}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);