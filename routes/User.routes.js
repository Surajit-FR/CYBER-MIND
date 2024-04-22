const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middleware/auth/auth_user');
const { UserExsists } = require('../middleware/user/check_user');
const UserController = require('../controller/user_controller');
const TaskController = require('../controller/task_controller');
const RequestRate = require('../helpers/request_limiter');
const { ImageUpload } = require('../helpers/media_config');
const ModelAuth = require('../middleware/auth/model_auth');
const ValidateEvent = require('../helpers/validator/validate_event');
const ValidateTask = require('../helpers/validator/validate_task');


/**************************************************** USER ROUTES ****************************************************/
// Update User Profile
router.post('/user/profile/update/:user_id', [RequestRate.Limiter, ImageUpload.single('profile_img'), VerifyToken, UserExsists], UserController.UpdateUserProfile);
// Get All User
router.get('/get/all/user', [RequestRate.Limiter, VerifyToken], UserController.GetAllUser);
// Get welcome sliders
router.get('/get/welcome/sliders', [RequestRate.Limiter], UserController.GetWelcomeSliders);

/**************************************************** EVENT ROUTES ****************************************************/
// Add events
router.post('/add/event', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateEvent)], TaskController.AddEvents);
// Get all events
router.get('/get/all/events', [RequestRate.Limiter, VerifyToken], TaskController.GetAllEvent);

/**************************************************** TASK ROUTES ****************************************************/
// Add tasks
router.post('/add/task', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateTask)], TaskController.AddTask);
// Get all tasks
router.get('/get/all/task', [RequestRate.Limiter, VerifyToken], TaskController.GetAllTask);
// Complete tasks
router.post('/complete/task/:task_id', [RequestRate.Limiter, VerifyToken], TaskController.CompleteTask);



module.exports = router;