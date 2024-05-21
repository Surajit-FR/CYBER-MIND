const JOI = require('joi');

module.exports = (TnxModel) => {
    const TransactionSchema = JOI.object({
        tnx_amount: JOI.number().required().messages({
            "any.required": "Transaction amount is required !!",
            "number.base": "Transaction amount must be a number !!",
        }),
        category: JOI.string().required().messages({
            "string.empty": "Category is required !!",
            "any.required": "Category is required !!",
        }),
        date_time: JOI.number().required().messages({
            "any.required": "Date & time is missing !!",
            "number.base": "Date & time must be a number !!",
        }),
        note: JOI.string().allow('').min(3).pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "Note is required !!",
            "string.min": "Note should be minimum 3 characters long !!",
            "string.pattern.base": "Only alphabets and blank spaces are allowed !!",
        }),
        tnx_type: JOI.string().required().pattern(/^[a-zA-Z]+$/).messages({
            "string.empty": "Transaction type is required !!",
            "string.pattern.base": "Only alphabets are allowed, both upper and lower case !!",
        }),
    });

    return TransactionSchema.validate(TnxModel);
};