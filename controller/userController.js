let catchAsyncError = require('../middleware/asyncFetchError');
let User = require('../models/userModel');
let Eventmodel = require('../models/eventModel');
let orderModel = require('../models/orderModel');
let errorHandler = require('../utills/errorHanlder');
let validator = require('../validator/userValidation');
let JwtToken = require('../utills/JwtToken');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');



module.exports = {
    userLogin: async (req, res, next) => {
        const { email, password } = req.body;
        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return next(new errorHandler("User not found. Signup Please", 401));
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return next(new errorHandler("Inavlid Email / Password", 201));
        }

        JwtToken(existingUser, 200, res)

    },
    userLogout: async (req, res, next) => {
        const { token } = req.cookies;

        if (!token) {
            return next(new errorHandler("Couldn't find token", 400));
        }
        JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Authentication failed" });
            }
            res.clearCookie(`${user.email}`);
            req.cookie[`token`] = "";
            return res.status(200).json({ success: true, message: "Successfully Logged Out" });
        });

    },
    userRegister: catchAsyncError(async (req, res, next) => {
        const { email, username, password } = req.body;

        await validator.userSchema.validateAsync(req.body);
        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            const hashedPassword = bcrypt.hashSync(password);
            const userData = {
                email, username,
                password: hashedPassword,
            };
            let newuser = new User(userData);
            await newuser.save();

            if (newuser) {

                JwtToken(newuser, 200, res);
            }
        } else {
            return next(new errorHandler("User already exists! Login Instead", 401))

        }
    }),

    getAlluser: catchAsyncError(async (req, res, next) => {

        let users = await User.find({});

        res.status(200).json({ success: true, message: users });
    }),
    getUser: catchAsyncError(async (req, res, next) => {
        const { email } = req.body;

        let existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return next(new errorHandler("User not found. Signup Please", 401));
        }
        res.status(200).json({ success: true, message: existingUser });
    }),

    createEvent: catchAsyncError(async (req, res, next) => {
        let { eventname } = req.body;

        let fileres = req.file && req.file.originalname ? `${req.protocol}://${req.hostname}:5000/upload/${req.file.originalname}` : 'https://picsum.photos/800/600'
        await validator.eventCreateSchema.validateAsync(req.body);
        let existingEvent = await Eventmodel.findOne({ eventname: eventname });
        if (!existingEvent) {
            const Eventcreate = Eventmodel.create({ ...req.body, event_img: fileres });

            return res.status(200).json({ success: true, message: Eventcreate });
        } else {
            return next(new errorHandler("Event already exists!", 401))

        }
    }),
    eventupdate: catchAsyncError(async (req, res, next) => {
        const { eventid } = req.params;
        let getSingleEvent = await Eventmodel.findOne({ _id: eventid });

        if (!getSingleEvent) {
            let updaEvent = await Eventmodel.findOneAndUpdate({ _id: eventid }, { ...req.body }, { new: true })
            return res.status(200).json({ success: true, message: updaEvent });
        } else {
            return next(new errorHandler("Event Not Found!", 401))
        }
    }),
    eventDelete: catchAsyncError(async (req, res, next) => {
        const { eventid } = req.params;


        let getSingleEvent = await Eventmodel.findOne({ _id: eventid });


        if (getSingleEvent) {
            await Eventmodel.findOneAndDelete({ _id: eventid })
            return res.status(200).json({ success: true, message: 'Event Deleted sucessfully.' });
        } else {
            return next(new errorHandler("Event Not Found!", 401))
        }
    }),
    getSingleEvent: catchAsyncError(async (req, res, next) => {
        const { eventid } = req.params;
        let getSingleEvent = await Eventmodel.findOne({ _id: eventid });
        if (getSingleEvent) {
            return res.status(200).json({ success: true, message: getSingleEvent });
        } else {
            return next(new errorHandler("Event Not Found!", 401))
        }
    }),
    getAllEvents: catchAsyncError(async (req, res, next) => {
        let allEvent = await Eventmodel.find({});

        return res.status(200).json({ success: true, message: allEvent });
    }),
    getAllorders: catchAsyncError(async (req, res, next) => {
        let allOrder = await orderModel.find({}).populate('userId');

        return res.status(200).json({ success: true, message: allOrder });
    }),
    getuserorder: catchAsyncError(async (req, res, next) => {
        let { userid } = req.params;

        let allUserOrder = await orderModel.find({ userId: userid }).populate('userId');
        if (allUserOrder.length) {
            return res.status(200).json({ success: true, message: allUserOrder });
        } else {
            return next(new errorHandler("Orders Not Found!", 401))
        }
    }),

    orderDelete: catchAsyncError(async (req, res, next) => {
        let { orderid } = req.params;
        let allOgetOrder = await orderModel.findOne({ _id: orderid });

        if (allOgetOrder) {
            return res.status(200).json({ success: true, message: allOrder });
        } else {
            return next(new errorHandler("Order Not Found!", 401))
        }

    }),
    eventPayment: catchAsyncError(async (req, res, next) => {

    }),
}