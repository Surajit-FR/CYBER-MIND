const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    family: { type: Schema.Types.ObjectId, ref: 'family' },
    task_title: { type: String, required: true },
    task_time: { type: Number, required: true },
    location: { type: String, default: "" },
    task_assignee: { type: Schema.Types.ObjectId, ref: 'user' },
    task_partner: [{ type: Schema.Types.ObjectId, required: true, ref: 'user' }],
    priority: { type: String, required: true },
    is_complete: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('task', TaskSchema);