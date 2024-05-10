const express = require('express');
const router = express.Router();
const RequestRate = require('../helpers/request_limiter');
const ModelAuth = require('../middleware/auth/model_auth');
const ValidateUser = require('../helpers/validator/validate_tnx');
const { VerifyToken } = require('../middleware/auth/auth_user');
const TransactionController = require('../controller/transaction_controller');

/**************************************************** TRANSACTION ROUTES ****************************************************/
// Get all transaction category
router.get('/get/all/tnx/category', [RequestRate.Limiter, VerifyToken], TransactionController.GetAllTransactionCategory);
// Add new transaction
router.post('/add/new/transaction', [RequestRate.Limiter, ModelAuth(ValidateUser), VerifyToken], TransactionController.AddNewTransaction);
// Get all transactions
router.get('/get/all/transactions', [RequestRate.Limiter, VerifyToken], TransactionController.GetAllTransaction);


module.exports = router;