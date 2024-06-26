const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middleware/auth/auth_user');
const { UserExsists, CheckUserFamily } = require('../middleware/user/check_user');
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
router.post('/user/profile/update', [RequestRate.Limiter, VerifyToken, UserExsists], UserController.UpdateUserProfile);
// Update User Profile Picture
router.post('/user/profile/image/update', [RequestRate.Limiter, ImageUpload.single('profile_img'), VerifyToken, UserExsists], UserController.UpdateUserProfileImage);

/**************************************************** MEMBER ROUTES ****************************************************/
// Add Member
router.post('/add/member', [RequestRate.Limiter, VerifyToken], UserController.AddMembers);
// Get All Members
router.get('/get/all/member', [VerifyToken], UserController.GetAllMember);

/**************************************************** FAMILY ROUTES ****************************************************/
// Add Family
router.post('/create/family', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateFamily)], UserController.CreateFamily);

/**************************************************** TASK & EVENTS ROUTES ****************************************************/
// Add events
router.post('/add/event', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateEvent)], TaskEventController.AddEvents);
// Get all events
router.get('/get/all/events', [VerifyToken], TaskEventController.GetAllEvent);

// Add tasks
router.post('/add/task', [RequestRate.Limiter, VerifyToken, ModelAuth(ValidateTask), TaskEventMiddleware.checkTaskPartnersFamily], TaskEventController.AddTask);
// Get all tasks
router.get('/get/all/task', [VerifyToken], TaskEventController.GetAllTask);
// Complete tasks
router.post('/complete/task/:task_id', [RequestRate.Limiter, VerifyToken, CheckUserFamily], TaskEventController.CompleteTask);
// Delete tasks
router.post('/delete/task/:task_id', [RequestRate.Limiter, VerifyToken, CheckUserFamily], TaskEventController.DeleteTask);



module.exports = router;