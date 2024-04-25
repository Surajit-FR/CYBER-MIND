const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middleware/auth/auth_user');
const { UserExsists } = require('../middleware/user/check_user');
const UserController = require('../controller/user_controller');
const TaskEventMiddleware = require('../middleware/user/task&event/check_task_event');
const TaskEventController = require('../controller/task_event_controller');
const RequestRate = require('../helpers/request_limiter');
const { ImageUpload } = require('../helpers/media_config');
const ModelAuth = require('../middleware/auth/model_auth');
const ValidateEvent = require('../helpers/validator/validate_event');
const ValidateTask = require('../helpers/validator/validate_task');
const ValidateFamily = require('../helpers/validator/validate_family');


/**************************************************** USER ROUTES ****************************************************/
// Update User Profile
router.post('/user/profile/update/:user_id', [RequestRate.Limiter, ImageUpload.single('profile_img'), VerifyToken, UserExsists], UserController.UpdateUserProfile);
// Get welcome sliders
router.get('/get/welcome/sliders', [RequestRate.Limiter], UserController.GetWelcomeSliders);

/**************************************************** MEMBER ROUTES ****************************************************/
// Add Member
router.post('/add/member', [RequestRate.Limiter, VerifyToken], UserController.AddMembers);
// Get All Members
router.get('/get/all/member', [RequestRate.Limiter, VerifyToken], UserController.GetAllMember);

/**************************************************** FAMILY ROUTES ****************************************************/
// Add Family
router.post('/create/family', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateFamily)], UserController.CreateFamily);

/**************************************************** TASK & EVENTS ROUTES ****************************************************/
// Add events
router.post('/add/event', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateEvent)], TaskEventController.AddEvents);
// Get all events
router.get('/get/all/events', [RequestRate.Limiter, VerifyToken], TaskEventController.GetAllEvent);

// Add tasks
router.post('/add/task', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateTask), TaskEventMiddleware.checkTaskPartnersFamily], TaskEventController.AddTask);
// Get all tasks
router.get('/get/all/task', [RequestRate.Limiter, VerifyToken], TaskEventController.GetAllTask);
// Complete tasks
router.post('/complete/task/:task_id', [RequestRate.Limiter, VerifyToken], TaskEventController.CompleteTask);



module.exports = router;