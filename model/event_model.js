const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    family: { type: Schema.Types.ObjectId, ref: 'family' },
    event_name: { type: String, required: true },
    location: { type: String, required: false },
    alert: { type: String, required: true },
    is_allDay: { type: Boolean, required: true },
    event_start_timestamp: { type: Number, required: true },
    event_end_timestamp: { type: Number, required: true },
    repeat: { type: String, required: false },
    url: { type: String, required: false },
    note: { type: String, required: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('event', EventSchema);