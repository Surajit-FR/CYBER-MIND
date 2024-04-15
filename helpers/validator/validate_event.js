const JOI = require('joi');

module.exports = (EventModel) => {
    const EventSchema = JOI.object({
        event_name: JOI.string().min(3).required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "Event name is required!",
            "string.min": "Minimum length should be 3",
            "string.pattern.base": "Only alphabets and blank spaces are allowed",
        }),
        location: JOI.string().min(3).required().pattern(/^[a-zA-Z0-9,\s-]+$/i).messages({
            "string.empty": "Location is required !!",
            "string.min": "Location should be minimum 3 characters long !!",
            "string.pattern.base": "Only lowercase alphabets, numbers, commas, and blank spaces are allowed !!",
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
        repeat: JOI.string().min(3).required().pattern(/^[a-zA-Z]+$/).messages({
            "string.empty": "Repeat field is required !!",
            "string.min": "Repeat field should be minimum 3 characters long !!",
            "string.pattern.base": "Only alphabets are allowed, both upper and lower case !!",
        }),
    })

    return EventSchema.validate(EventModel);
};