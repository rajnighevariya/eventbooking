const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
const eventCreateSchema = Joi.object({
    beneficiary: Joi.string().allow(),
    event_img: Joi.string().allow(),
    eventtype: Joi.string().allow(),
    passquantity: Joi.number().allow(),
    age: Joi.string().allow(),
    eventname: Joi.string()
        .required(),
    startdate: Joi.string()
        .required(),
    enddate: Joi.string()
        .allow(),
    eventmode: Joi.string()
        .required(),
    runby: Joi.string()
        .required(),
    venue: Joi.string()
        .required(),
    registration_fee: Joi.string()
        .required(),
})

module.exports = {
    userSchema,
    eventCreateSchema
};

