const mongoose = require("mongoose");
const JWT = require('jsonwebtoken')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    roles: {
        type: String,
        default: 'User'
    },
    qrcode: {
        type: String,
    },
    qrcode_expired: {
        type: Boolean,
        default: false,
    },
    userpreset: {
        type: String,
        default: 'no'
    },
    paymentstatus: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });

userSchema.methods.getJwtToken = function () {
    return JWT.sign({ email: this.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}

module.exports = mongoose.model("User", userSchema);


