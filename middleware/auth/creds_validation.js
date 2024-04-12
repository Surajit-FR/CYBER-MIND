const UserModel = require('../../model/user_model');
const bcrypt_js = require('bcryptjs');


// HandleLoginError
exports.HandleLoginError = async (req, res, next) => {
    const { credential, password, auth_type } = req.body;

    try {
        if (!credential || (!password && auth_type !== 'social')) {
            return res.status(400).send({
                success: false,
                message: !credential ? 'Email /Phone /Username is required!' : 'Password is required!',
                key: !credential ? 'credential' : 'password'
            });
        }

        let user;

        // Check if the credential is in email format
        if ((/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(credential)) {
            user = await UserModel.findOne({ email: credential });
        }
        // Check if the credential is in phone format
        else if ((/^[0-9]{10}$/).test(credential)) {
            user = await UserModel.findOne({ phone: credential });
        }
        // If not email or phone, consider it as a username
        else {
            user = await UserModel.findOne({ username: credential });
        }

        if (!user) {
            return res.status(404).send({ success: false, message: "Account not found. Double-check your credential or sign up if you're new.", key: 'user' });
        }

        // Need to keep 'await' before bcrypt_js.compare()
        if (auth_type !== 'social' && !(await bcrypt_js.compare(password, user.password))) {
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


// Forget password check
exports.ForgetPasswordCheck = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
        // Check if both email and phone are missing
        if (!email && !phone) {
            return res.status(400).json({ success: false, message: "Please provide either email or phone", key: "email_phone" });
        }


        let existingUser;
        if (email) {
            existingUser = await UserModel.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ success: false, message: `User not found with email-id: '${email}'`, key: "email" });
            }
        }

        if (phone) {
            existingUser = await UserModel.findOne({ phone });
            if (!existingUser) {
                return res.status(404).json({ success: false, message: `User not found with phone number: '${phone}'`, key: "phone" });
            }
        }

        req.user = existingUser;
        req.passwordRequired = true; // Flag indicating that password is required
        next();

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Try Again", error: exc.message });
    };
};

