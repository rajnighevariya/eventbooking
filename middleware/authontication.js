const catchAsyncError = require("./asyncFetchError");
const JWT = require('jsonwebtoken')
const ErrorHandler = require("../utills/errorHanlder");
let User = require('../models/userModel');

module.exports = {
    isUserAdmin: (...roles) => {
        return (req, res, next) => {

            if (!roles.includes(req.user.roles)) {
                return next(
                    new ErrorHandler(
                        `Role: ${req.user.roles} is not Allowed to access this resource.`, 403
                    )
                )
            }
            next()
        }
    },
    isAuthonticate: catchAsyncError(async (req, res, next) => {
        const token = req.headers.token || req.cookies.token;

        // console.log(token, 'token')
        if (!token) {
            return next(new ErrorHandler("Please Login to access this resource", 401))
        }

        let decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)

        req.user = await User.findOne({ email: decoded.email })
        next();
    })
}