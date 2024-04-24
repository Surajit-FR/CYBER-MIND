const MemberModel = require("../model/member_model");

exports.checkAdminPermission = async (userId, familyId) => {
    try {
        // Query the Membership collection to check if the user is the admin of the family
        const membership = await MemberModel.findOne({ user: userId, family: familyId });
        // If no membership found, return false
        if (!membership) {
            return false;
        }

        // Return true if the user is the admin
        return true;
    } catch (error) {
        console.error(error);
        throw error; // Throw the error to be caught by the calling function
    }
};

