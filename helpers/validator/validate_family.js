const JOI = require('joi');

module.exports = (FamilyModel) => {
    const FamilySchema = JOI.object({
        family_name: JOI.string().min(3).required().pattern(/^[a-zA-Z ]+$/).messages({
            "string.empty": "Family name is required!",
            "string.min": "Minimum length should be 3",
            "string.pattern.base": "Only alphabets and blank spaces are allowed",
        }),
    })

    return FamilySchema.validate(FamilyModel);
};