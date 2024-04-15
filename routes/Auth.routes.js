const express = require('express');
const router = express.Router();
const { DuplicateUserCheck } = require('../middleware/auth/duplicate_check');
const { HandleLoginError, ForgetPasswordCheck } = require('../middleware/auth/creds_validation');
const AuthController = require('../controller/auth_controller');
const ValidateUser = require('../helpers/validator/validate_user');
const ModelAuth = require('../middleware/auth/model_auth');
const RequestRate = require('../helpers/request_limiter');

// Login user
router.post('/user/login', [RequestRate.Limiter, HandleLoginError], AuthController.Login);
// Register user
router.post('/user/register', [RequestRate.Limiter, ModelAuth(ValidateUser), DuplicateUserCheck], AuthController.Register);
// User forget password
router.post('/user/forget/password', [RequestRate.Limiter, ForgetPasswordCheck], AuthController.ForgetPassword);


module.exports = router;