const CategoryModel = require('../model/admin/category_model');
const WelcomeSliderModel = require('../model/admin/welcome_slider_model');


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

// Get all category
exports.GetAllCategory = async (req, res) => {
    try {
        const all_category_data = await CategoryModel.find({});
        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: all_category_data });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};