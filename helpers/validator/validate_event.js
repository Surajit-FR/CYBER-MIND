const JOI = require('joi');

module.exports = (EventModel) => {
    const EventSchema = JOI.object({
        event_name: JOI.string().min(3).required().messages({
            "string.empty": "Event name is required!",
            "string.min": "Minimum length should be 3",
        }),
        alert: JOI.string().min(4).required().pattern(/^[a-zA-Z0-9\s]+$/).messages({
            "string.empty": "Alert is missing !!",
            "string.min": "Alert should be minimum 4 characters long !!",
            "string.pattern.base": "Only alphabets, numbers, and blank spaces are allowed !!",
        }),
        event_start_timestamp: JOI.number().required().messages({
            "any.required": "Event start timestamp is missing !!",
            "number.base": "Event start timestamp must be a number !!",
        }),
        event_end_timestamp: JOI.number().required().messages({
            "any.required": "Event end timestamp is missing !!",
            "number.base": "Event end timestamp must be a number !!",
        }),
        location: JOI.allow("").optional(),
        repeat: JOI.allow("").optional(),
        url: JOI.allow("").optional(),
        note: JOI.allow("").optional(),
        is_allDay: JOI.boolean().required(),
    })

    return EventSchema.validate(EventModel);
};