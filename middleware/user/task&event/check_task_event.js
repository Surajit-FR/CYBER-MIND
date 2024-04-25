const UserModel = require("../../../model/user_model");

// Define a middleware function to check if all task partners belong to the same family
exports.checkTaskPartnersFamily = async (req, res, next) => {
    const { task_partner } = req.body;
    const decoded_token = req.decoded_token;

    try {
        // Fetch family based on who added the event.
        const assignee = await UserModel.findById(decoded_token._id);
        const assigneeFamilyId = assignee.family;

        let isValid = true;

        // Check if all task partners belong to the same family as the assignee
        await Promise.all(task_partner.map(async (partnerId) => {
            const partner = await UserModel.findById(partnerId);
            if (!partner || partner.family !== assigneeFamilyId) {
                isValid = false;
            }
        }));

        if (!isValid) {
            return res.status(400).json({ success: false, message: "All task partners must belong to the same family as the assignee." });
        }

        // If all partners belong to the same family, proceed to the next middleware or route handler
        next();

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};
