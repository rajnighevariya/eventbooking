let express = require('express');
let router = express.Router();
let controller = require('../controller/strepeController');
const Auth = require('../middleware/authontication');

router.post('/create-checkout-session', Auth.isAuthonticate, controller.stripeSession)
router.post('/webhook', express.raw({ type: 'application/json' }), controller.stripeWebhook);
router.post('/getcustomer', Auth.isAuthonticate, controller.getCustomer)
router.post('/getpayment', Auth.isAuthonticate, controller.getPaymnet)


module.exports = router;