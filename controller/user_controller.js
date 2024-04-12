const UserModel = require('../model/user_model');
const WelcomeSliderModel = require('../model/admin/welcome_slider_model');
const SecurePassword = require('../helpers/secure_password');
const CreateToken = require('../helpers/create_token');
const { deleteFile } = require('../helpers/file_utils');


// Update User Profile
exports.UpdateUserProfile = async (req, res) => {
    const { username, email, phone, city_state, password, type } = req.body;
    const { user_id } = req.params;

    try {
        const HashedPassword = await SecurePassword(password);

        // Remove "public" prefix from file path
        const filePath = req?.file?.path?.replace('public', '');

        const UpdatedUser = await UserModel.findByIdAndUpdate(
            { _id: user_id },
            {
                username,
                profile_img: filePath,
                email,
                phone,
                city_state,
                password: HashedPassword,
                type,
            },
            { new: true }
        );

        const tokenData = CreateToken(UpdatedUser);
        return res.status(201).json({ success: true, message: "Profile updated successfully!", data: UpdatedUser, token: tokenData });

    } catch (exc) {
        // Delete uploaded file if an error occurred during upload
        if (req?.file) {
            try {
                await deleteFile(req?.file?.path);
                console.log("File deleted successfully");
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Get All User
exports.GetAllUser = async (req, res) => {
    try {
        // Ensure type index is created for faster querying
        await UserModel.createIndexes();

        const all_user_data = await UserModel
            .find({ type: "user" })
            .select('-password -__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_user_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Get welcome sliders
exports.GetWelcomeSliders = async (req, res) => {
    try {
        const all_sliders_data = await WelcomeSliderModel.find({});
        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_sliders_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};
