const TransactionCategoryModel = require('../model/admin/transaction_category_model');

// Get all transaction category
exports.GetAllTransactionCategory = async (req, res) => {
    try {
        await TransactionCategoryModel.createIndexes();
        const all_tnx_category_data = await TransactionCategoryModel
            .find({ is_delete: false })
            .select('-_id -is_delete -createdAt -updatedAt -__v') // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: all_tnx_category_data?.length > 0 ? "Data fetched successfully!" : "No data found!", data: all_tnx_category_data });
    } catch (error) {
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};