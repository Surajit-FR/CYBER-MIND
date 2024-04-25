const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    family: { type: Schema.Types.ObjectId, ref: 'family' },
    task_title: { type: String, require: true },
    task_time: { type: Number, require: true },
    location: { type: String, default: "" },
    task_assignee: { type: Schema.Types.ObjectId, ref: 'user' },
    task_partner: [{ type: Schema.Types.ObjectId, require: true, ref: 'user' }],
    priority: { type: String, require: true },
    is_complete: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('task', TaskSchema);