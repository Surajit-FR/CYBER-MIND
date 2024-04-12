const UserModel = require('../model/user_model');
const SecurePassword = require('../helpers/secure_password');
const CreateToken = require('../helpers/create_token');
const JOI = require('joi');


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


// Login user
exports.Login = async (req, res) => {
    const { remember_me } = req.body;
    try {
        // Accessing the user object attached by the middleware 
        const _user = req.user;
        const USER_DATA = { ..._user._doc, remember_me };
        const tokenData = CreateToken(_user);
        return res.status(200).json({ success: true, message: "Login Successful!", data: USER_DATA, token: tokenData });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    }
};

// Register user
exports.Register = async (req, res) => {
    const { username, email, password, type, auth_type } = req.body;
    try {
        const HashedPassword = await SecurePassword(password);
        const NewUser = await UserModel({
            username,
            email,
            password: HashedPassword,
            type
        });

        const userData = await NewUser.save();
        const tokenData = CreateToken(NewUser);
        return res.status(201).json({ success: true, message: "Registered Successfully!", data: userData, token: tokenData });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
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