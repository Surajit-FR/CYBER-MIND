const { findUserByCredential } = require('../../helpers/find_user_by_credential');
const UserModel = require('../../model/user_model');
const bcrypt_js = require('bcryptjs');


// HandleRegularLoginError
exports.HandleRegularLoginError = async (req, res, next) => {
    const { credential, password } = req.body;

    try {
        if (!credential || !password) {
            return res.status(400).send({
                success: false,
                message: !credential ? 'Email /Phone  is required!' : 'Password is required!',
                key: !credential ? 'credential' : 'password'
            });
        }

        const user = await findUserByCredential(credential);

        if (!user) {
            return res.status(404).send({ success: false, message: "Account not found. Double-check your credential or sign up if you're new.", key: 'user' });
        }

        // Need to keep 'await' before bcrypt_js.compare()
        if (!(await bcrypt_js.compare(password, user.password))) {
            return res.status(401).send({ success: false, message: 'Invalid password!', key: 'password' });
        }

        if (user.is_delete === true) {
            return res.status(403).json({ success: false, message: 'Your account has been deleted. Please contact support for further assistance.', key: 'user' });
        }

        // If user is found and either auth_type is social or password matches, proceed to the next middleware
        req.user = user; // Attach user object to the request
        next();

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Try Again", error: exc.message });
    };
};

// HandleSocialAuthError
exports.HandleSocialAuthError = async (req, res, next) => {
    const { email, uid, displayName, photoURL, phoneNumber, providerId } = req.body;

    try {
        // Check if all required fields are present
        if (!email || !uid || !displayName || !photoURL || !providerId) {
            return res.status(400).send({
                success: false,
                message: 'Social login data is missing or incomplete!',
                key: 'social_login_data'
            });
        };

        let user;

        if (email) {
            user = await UserModel.findOne({ email: email });
        }
        else if (phoneNumber) {
            user = await UserModel.findOne({ phone: phoneNumber });
        };

        // If user exists, attach user object to the request and skip password check
        if (user) {
            // If user exists and is deleted, return appropriate response
            if (user.is_delete === true) {
                return res.status(403).json({ success: false, message: 'Your account has been deleted. Please contact support for further assistance.', key: 'user' });
            }
            req.user = user;
            return next();
        } else {
            // If user doesn't exist, proceed to the next middleware/controller
            return next();
        }

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again.", error: exc.message });
    }
};

