const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../../middleware/auth/auth_user');
const RequestRate = require('../../helpers/request_limiter');
const AdminController = require('../../controller/admin/admin_controller');
const { ImageUpload } = require('../../helpers/media_config');


// User forget password
router.post('/add/category', [RequestRate.Limiter, ImageUpload.single('cat_image_url'), VerifyToken], AdminController.AddCategory);
// User forget password
router.post('/add/welcome/slider', [RequestRate.Limiter, ImageUpload.single('scr_img'), VerifyToken], AdminController.AddWelcomeSlider);


module.exports = router;