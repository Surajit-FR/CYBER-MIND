const JOI = require('joi');

module.exports = (TaskModel) => {
    const TaskSchema = JOI.object({
        task_title: JOI.string().min(3).required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "Task title is required !!",
            "string.min": "Minimum length should be 3",
            "string.pattern.base": "Only alphabets and blank spaces are allowed !!",
        }),
        task_assignee: JOI.string().required().messages({
            "string.empty": "Task assignee is missing !!",
        }),
        task_partner: JOI.array().items(JOI.string()).required().min(1).messages({
            "array.empty": "Please add at least one task partner !!",
            "any.required": "Please add a task partner !!",
        }),
        task_time: JOI.number().required().messages({
            "any.required": "Event start timestamp is missing !!",
            "number.base": "Event start timestamp must be a number !!",
        }),
        priority: JOI.string().min(3).required().pattern(/^[a-zA-Z]+$/).messages({
            "string.empty": "Repeat field is required !!",
            "string.min": "Repeat field should be minimum 3 characters long !!",
            "string.pattern.base": "Only alphabets are allowed, both upper and lower case !!",
        }),
    });

    return TaskSchema.validate(TaskModel);
};