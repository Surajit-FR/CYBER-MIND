const UserModel = require('../../model/user_model');
const FamilyModel = require('../../model/family_model');
const MemberModel = require('../../model/member_model');

// Check exsisting users
exports.UserExsists = async (req, res, next) => {
    try {
        const decoded_token = req.decoded_token;
        const user_id = decoded_token._id;

        const exsistingUser = await UserModel.findById({ _id: user_id });
        if (!exsistingUser) {
            return res.status(404).json({ success: false, message: "User not found!", key: "user" });
        }
        next();

    } catch (exc) {
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Check if the user belongs to a family
exports.CheckUserFamily = async (req, res, next) => {
    try {
        // Retrieve data from the token received
        const decoded_token = req.decoded_token;

        // Fetch family based on the family_hash_id from the token
        const family = await FamilyModel.findOne({ family_hash_id: decoded_token.family });

        if (!family) {
            return res.status(403).json({ success: false, message: "You do not belong to any family" });
        }

        // Check if the user and family IDs are defined
        if (!family._id || !decoded_token._id) {
            return res.status(400).json({ success: false, message: "Invalid user or family information" });
        }

        // Check if the user belongs to the family
        const userBelongsToFamily = await MemberModel.findOne({ family: family._id, user: decoded_token._id });

        if (!userBelongsToFamily) {
            return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
        }

        // Attach the family and user information to the request object
        req.family = family;
        req.decoded_token = decoded_token;

        // Proceed to the next middleware or route handler
        next();
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};