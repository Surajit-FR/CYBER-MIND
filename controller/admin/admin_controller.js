const CategoryModel = require('../../model/admin/category_model');
const WelcomeSliderModel = require('../../model/admin/welcome_slider_model');
const UserModel = require('../../model/user_model');


// add category
exports.AddCategory = async (req, res) => {
    const { category_name } = req.body;

    try {
        const decoded_token = req.decoded_token;

        if (decoded_token.type === "user") {
            return res.status(403).json({ success: false, message: "You do not have permission to access this resource.", key: "user_permission" });
        } else if (decoded_token.type === "admin") {
            // Remove "public" prefix from file path
            const filePath = req?.file?.path?.replace('public', '');

            // Check for empty fields
            if (!(category_name && filePath)) {
                return res.status(400).json({ success: false, message: "Category name & image URL are required!" });
            }

            const NewCategory = await CategoryModel({
                category_name,
                cat_image_url: filePath,
            });
            await NewCategory.save();
            return res.status(201).json({ success: true, message: "Category added successfully!" });
        }

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

// add welcome slider
exports.AddWelcomeSlider = async (req, res) => {
    const { heading, para } = req.body;

    try {
        const decoded_token = req.decoded_token;

        if (decoded_token.type === "user") {
            return res.status(403).json({ success: false, message: "You do not have permission to access this resource.", key: "user_permission" });
        } else if (decoded_token.type === "admin") {
            // Remove "public" prefix from file path
            const filePath = req?.file?.path?.replace('public', '');

            // Check for empty fields
            if (!(heading && para && filePath)) {
                return res.status(400).json({ success: false, message: "Heading name, paragraph content & image URL are required!" });
            }

            const NewWelcomeSlider = await WelcomeSliderModel({
                heading,
                para,
                scr_img: filePath,
            });
            await NewWelcomeSlider.save();
            return res.status(201).json({ success: true, message: "Welcome slider added successfully!" });
        }

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


/********* ALTER DB FIELDS *********/
exports.ModifyDBdata = async (req, res) => {

    await UserModel.updateMany({}, {
        $set: { family: "" }
    });

    return res.send("Done.....");
};