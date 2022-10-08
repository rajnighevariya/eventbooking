const mongoose = require("mongoose");
const JWT = require('jsonwebtoken')

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_img: {
        type: String,
    },
    eventname: {
        type: String,
        required: true,
    },
    runby: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    eventtype: {
        type: String,
        required: true,
    },
    beneficiary: {
        type: String,
        default: 'Children'
    },
    age: {
        type: String,
        default: '4 to 17 years'
    },
    eventmode: {
        type: String,
        default: 'online'
    },
    registration_fee: {
        type: Number,
        default: 1100
    },
    startdate: {
        type: String
    },
    enddate: {
        type: String
    },
    eventstatus: {
        type: String,
        default: 'Open'
    },
    passquantity: {
        type: Number,
        default: 100
    }
}, { timestamps: true, versionKey: false });


module.exports = mongoose.model("Events", eventSchema);


