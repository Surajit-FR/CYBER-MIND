const UserModel = require('../model/user_model');
const SecurePassword = require('../helpers/secure_password');
const CreateToken = require('../helpers/create_token');
const JOI = require('joi');
const { GoogleAuth } = require('../helpers/social_auth');


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
        const tokenData = CreateToken(_user);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    }
};

// Register user (Regular)
exports.RegisterUserRegular = async (req, res) => {
    const { username, email, password, type } = req.body;
    try {
        const HashedPassword = await SecurePassword(password);
        const NewUser = await UserModel({
            username,
            email,
            password: HashedPassword,
            type
        });

        const userData = await NewUser.save();
        const USER_DATE = { ...userData._doc, auth_type: "regular" };
        const tokenData = CreateToken(NewUser);
        return res.status(201).json({ success: true, message: "Registered Successfully!", data: USER_DATE, token: tokenData });
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
        const USER_DATA = { ...user._doc, auth_type: "social" };
        const tokenData = CreateToken(user);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Forget password
exports.ForgetPassword = async (req, res) => {
    const passwordRequired = req.passwordRequired;

    try {
        if (passwordRequired) {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ success: false, message: "Please provide a password!", key: "password", password_required: passwordRequired });
            }
            // Validate password
            const { error } = passwordSchema.validate(password);
            if (error) {
                return res.status(400).json({ success: false, message: error.message, key: "password" });
            }
            const HashedPassword = await SecurePassword(password);
            const _user = req.user;
            await UserModel.findByIdAndUpdate(
                _user._id,
                {
                    password: HashedPassword,
                },
                { new: true }
            );
            return res.status(201).json({ success: true, message: "Password updated successfully!" });
        } else {
            return res.status(200).json({ success: true, message: "Password not required for this user.", password_required: passwordRequired });
        }
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};