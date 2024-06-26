const express = require('express');
const router = express.Router();
const RequestRate = require('../helpers/request_limiter');
const ModelAuth = require('../middleware/auth/model_auth');
const ValidateTnx = require('../helpers/validator/validate_tnx');
const { VerifyToken } = require('../middleware/auth/auth_user');
const { CheckUserFamily } = require('../middleware/user/check_user');
const TransactionController = require('../controller/transaction_controller');

/**************************************************** TRANSACTION ROUTES ****************************************************/
// Get all transaction category
router.get('/get/all/tnx/category', [RequestRate.Limiter, VerifyToken], TransactionController.GetAllTransactionCategory);
// Add new transaction
router.post('/add/new/transaction', [RequestRate.Limiter, ModelAuth(ValidateTnx), VerifyToken], TransactionController.AddNewTransaction);
// Get all transactions
router.get('/get/all/transactions', [RequestRate.Limiter, VerifyToken, CheckUserFamily], TransactionController.GetAllTransaction);
// Get balance
router.get('/get/balance', [RequestRate.Limiter, VerifyToken, CheckUserFamily], TransactionController.GetBalance);


module.exports = router;