const UserModel = require('../model/user_model');
const SecurePassword = require('../helpers/secure_password');
const CreateToken = require('../helpers/create_token');
const JOI = require('joi');
const { GoogleAuth } = require('../helpers/social_auth');
const { findUserByCredential } = require('../helpers/find_user_by_credential');


// Define password schema for validation
const passwordSchema = JOI.string()
    .min(8)
    .max(16)
    .required()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])([a-zA-Z0-9@#\$%\^\&*\)\(+=._-]){8,}$/)
    .messages({
        "string.empty": "Password is required !!",
        "string.min": "Password should be minimum 8 characters long !!",
        "string.max": "Password should be maximum 16 characters long !!",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number & one special character !!",
    });


// Login user (Regular)
exports.LoginUserRegular = async (req, res) => {
    const { remember_me } = req.body;
    try {
        // Accessing the user object attached by the middleware 
        const _user = req.user;
        const USER_DATA = { ..._user._doc, remember_me, auth_type: "regular" };
        const tokenData = CreateToken(USER_DATA);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    }
};

// Register user (Regular)
exports.RegisterUserRegular = async (req, res) => {
    const { full_name, email, password, type } = req.body;
    try {
        const HashedPassword = await SecurePassword(password);
        const NewUser = await UserModel({
            full_name,
            email: email.toLowerCase(),
            password: HashedPassword,
            type
        });

        const userData = await NewUser.save();
        const USER_DATA = { ...userData._doc, remember_me: false, auth_type: "regular" };
        const tokenData = CreateToken(USER_DATA);
        return res.status(201).json({ success: true, message: "Registered Successfully!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    }
};

// Auth user (Social)
exports.AuthUserSocial = async (req, res) => {
    try {
        // Check if user object is already attached by the middleware
        let user = req.user;

        // If user object is not attached, it means user needs to be fetched from req.body
        if (!user) {
            const { email, uid, displayName, photoURL, phoneNumber, providerId } = req.body;

            // Check if user already exists in the database
            user = await UserModel.findOne({ email: email });

            if (!user) {

                // If user doesn't exist, create a new one
                if (providerId === "google.com") {
                    user = await GoogleAuth(email, uid, displayName, photoURL, phoneNumber);
                } else if (providerId === "facebook.com") {
                    return res.status(400).json({ success: false, message: "Facebook login is not supported yet" });
                }
                // Handle error while creating user
                if (user.err) {
                    return res.status(500).json({ success: false, message: user.message, error: user.err });
                }
            }
        };

        // Continue with login logic
        const USER_DATA = { ...user._doc, remember_me: false, auth_type: "social" };
        const tokenData = CreateToken(USER_DATA);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Forget password verify user
exports.ForgetPassVerifyUser = async (req, res, next) => {
    const { credential } = req.body;

    try {
        const existingUser = await findUserByCredential(credential);

        // Check if both email and phone are missing
        if (!credential) {
            return res.status(400).json({ success: false, message: "Please provide either email or phone", key: "email_phone" });
        } else if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found with this credential.", key: "credential" });
        } else {
            return res.status(202).json({ success: true, message: "Password change process initiated. Please proceed to reset your password.", user_id: existingUser._id });
        };

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Try Again", error: exc.message });
    };
};

// Update password
exports.UpdatePassword = async (req, res) => {
    const { password, user_id } = req.body;

    try {

        if (!password) {
            return res.status(400).json({ success: false, message: "Please provide a password!", key: "password" });
        }
        if (!user_id) {
            return res.status(400).json({ success: false, message: "User Id is missing.", key: "user_id" });
        }
        const { error } = passwordSchema.validate(password);
        // Validate password
        if (error) {
            return res.status(400).json({ success: false, message: error.message, key: "password" });
        };

        const HashedPassword = await SecurePassword(password);

        await UserModel.findByIdAndUpdate(
            user_id,
            {
                password: HashedPassword,
            },
            { new: true }
        );
        return res.status(201).json({ success: true, message: "Password updated successfully!" });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};