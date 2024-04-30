const express = require('express');
const router = express.Router();
const UtilityController = require('../controller/utility_controller');
const { VerifyToken } = require('../middleware/auth/auth_user');


// Get welcome sliders
router.get('/get/welcome/sliders', UtilityController.GetWelcomeSliders);
router.get('/get/all/category', [VerifyToken], UtilityController.GetAllCategory);

module.exports = router;