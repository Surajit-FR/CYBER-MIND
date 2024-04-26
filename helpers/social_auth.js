const UserModel = require('../model/user_model');
const SecurePassword = require('../helpers/secure_password');


// GoogleAuth
exports.GoogleAuth = async (email, uid, displayName, photoURL, phoneNumber) => {
    try {
        const HashedPassword = await SecurePassword(uid);

        const NewUser = await UserModel({
            full_name: displayName,
            profile_img: photoURL,
            email: email,
            phone: phoneNumber,
            password: HashedPassword,
            type: "user",
        });
        const userData = await NewUser.save();

        return userData;

    } catch (exc) {
        console.log(exc.message);
        return { message: "Error login with gmail!", err: exc.message };
    };
};