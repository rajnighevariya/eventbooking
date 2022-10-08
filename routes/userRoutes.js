let express = require('express');
let router = express.Router();
let controller = require('../controller/userController');
const Auth = require('../middleware/authontication');

const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

router.get('/order/:userid', Auth.isAuthonticate, controller.getuserorder);
router.get('/order/all', Auth.isAuthonticate, Auth.isUserAdmin('Admin'), controller.getAllorders);
router.get('/event/all', controller.getAllEvents);
router.post('/get', Auth.isAuthonticate, controller.getUser);
router.get('/all', Auth.isAuthonticate, controller.getAlluser);
router.post('/login', controller.userLogin);
router.post('/register', controller.userRegister);
router.post('/logout', controller.userLogout);
router.post('/event/create', Auth.isAuthonticate, Auth.isUserAdmin('Admin'), upload.single('event_img'), controller.createEvent);
router.route('/event/:eventid')
    .patch(Auth.isAuthonticate, Auth.isUserAdmin('Admin'), controller.eventupdate)
    .delete(Auth.isAuthonticate, Auth.isUserAdmin('Admin'), controller.eventDelete)
    .get(Auth.isAuthonticate, Auth.isUserAdmin('Admin'), controller.getSingleEvent);



module.exports = router;

