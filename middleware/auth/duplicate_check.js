const UserModel = require('../../model/user_model');

// DuplicateUserCheck middleware
exports.DuplicateUserCheck = async (req, res, next) => {
    const { email, username } = req.body;

    try {
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ success: false, message: "Email already exists!", key: "email" });
            } else {
                return res.status(409).json({ success: false, message: "Username already exists!", key: "username" });
            }
        }
        next();

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Try Again", error: exc.message });
    };
};