const express = require('express');
const router = express.Router();
const { DuplicateUserCheck } = require('../middleware/auth/duplicate_check');
const { HandleRegularLoginError, ForgetPasswordCheck, HandleSocialAuthError } = require('../middleware/auth/creds_validation');
const AuthController = require('../controller/auth_controller');
const ValidateUser = require('../helpers/validator/validate_user');
const ModelAuth = require('../middleware/auth/model_auth');
const RequestRate = require('../helpers/request_limiter');

// Login user (regular)
router.post('/user/login', [RequestRate.Limiter, HandleRegularLoginError], AuthController.LoginUserRegular);
// Auth user (social)
router.post('/user/social', [RequestRate.Limiter, HandleSocialAuthError], AuthController.AuthUserSocial);
// Register user (regular)
router.post('/user/register', [RequestRate.Limiter, ModelAuth(ValidateUser), DuplicateUserCheck], AuthController.RegisterUserRegular);
// User forget password
router.post('/user/forget/password', [RequestRate.Limiter, ForgetPasswordCheck], AuthController.ForgetPassword);


module.exports = router;