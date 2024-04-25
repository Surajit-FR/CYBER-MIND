const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    family: { type: Schema.Types.ObjectId, ref: 'family' },
    event_name: { type: String, require: true },
    location: { type: String, require: true },
    alert: { type: String, require: true },
    ia_allDay: { type: Boolean, default: false },
    event_start_timestamp: { type: Number, require: true },
    event_end_timestamp: { type: Number, require: true },
    repeat: { type: String, require: true },
    url: { type: String, default: "" },
    note: { type: String, default: "" },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('event', EventSchema);