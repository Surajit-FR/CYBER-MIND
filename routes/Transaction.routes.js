const express = require('express');
const router = express.Router();
const RequestRate = require('../helpers/request_limiter');
const { VerifyToken } = require('../middleware/auth/auth_user');
const TransactionController = require('../controller/transaction_controller');

/**************************************************** TRANSACTION ROUTES ****************************************************/
// Get all transaction category
router.get('/get/all/tnx/category', [RequestRate.Limiter, VerifyToken], TransactionController.GetAllTransactionCategory);


module.exports = router;