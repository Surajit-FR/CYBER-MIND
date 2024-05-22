const TransactionCategoryModel = require('../model/admin/transaction_category_model');
const TransactionModel = require('../model/transaction_model');

// Get all transaction category
exports.GetAllTransactionCategory = async (req, res) => {
    try {
        await TransactionCategoryModel.createIndexes();
        const all_tnx_category_data = await TransactionCategoryModel
            .find({ is_delete: false })
            .sort({ date_time: -1 }) // Ensure recently added data is shown first
            .select('-is_delete -createdAt -updatedAt -__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: all_tnx_category_data?.length > 0 ? "Data fetched successfully!" : "No data found!", data: all_tnx_category_data });
    } catch (error) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Add new transaction
exports.AddNewTransaction = async (req, res) => {
    const { tnx_amount, category, note, date_time, tnx_type } = req.body;
    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;
        const user_id = decoded_token?._id;

        const NewTransction = await TransactionModel({
            user: user_id,
            tnx_amount,
            category,
            note,
            date_time,
            tnx_type,
        });

        await NewTransction.save();
        return res.status(201).json({ success: true, message: "New transaction added!" });
    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Add new transaction
exports.GetAllTransaction = async (req, res) => {
    try {
        // Retrieve data from token recieved.
        const decoded_token = req.decoded_token;
        const user_id = decoded_token?._id;

        // Ensure type index is created for faster querying
        await TransactionModel.createIndexes();

        const user_tnx_data = await TransactionModel
            .find({ user: user_id, is_delete: false })
            .populate({
                path: 'category',
                select: '-createdAt -updatedAt -__v'
            })
            .select('-__v')
            .sort({ date_time: -1 })
            .lean();

        return res.status(200).json({ success: true, message: "Data fetched successfully!", data: user_tnx_data });

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};