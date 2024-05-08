const UserModel = require('../../model/user_model');

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