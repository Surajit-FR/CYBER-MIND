const CategoryModel = require('../../model/admin/category_model');
const TransactionCategoryModel = require('../../model/admin/transaction_category_model');
const WelcomeSliderModel = require('../../model/admin/welcome_slider_model');


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
                category_name: category_name.trim(),
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
                heading: heading.trim(),
                para: para.trim(),
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

// add transaction category
exports.AddTransactionCategory = async (req, res) => {
    const { transaction_category_name } = req.body;

    try {
        const decoded_token = req.decoded_token;

        if (decoded_token.type === "user") {
            return res.status(403).json({ success: false, message: "You do not have permission to access this resource.", key: "user_permission" });
        } else if (decoded_token.type === "admin") {
            // Check for empty fields
            if (!transaction_category_name) {
                return res.status(400).json({ success: false, message: "A transaction category name is required!" });
            }

            const NewTransactionCategory = await TransactionCategoryModel({
                transaction_category_name: transaction_category_name.trim(),
            });
            await NewTransactionCategory.save();
            return res.status(201).json({ success: true, message: "A New Transaction Category added!" });
        }
    } catch (error) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};






/********* ALTER DB FIELDS *********/
exports.ModifyDBdata = async (req, res) => {

    await CategoryModel.updateMany({}, {
        $set: {
            screen_name: ""
        }
    });

    return res.send("Done.....");
};