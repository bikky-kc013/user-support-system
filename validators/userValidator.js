const Joi  = require("joi");

const gmail = /^[^\s@]+@gmail\.com$/;
const userRegisterValidator = Joi.object({
    username: Joi.string().required().error(new Error('Username is required')),
    email: Joi.string()
        .regex(gmail)
        .required()
        .messages({
            'any.required': 'Email is required',
            'string.pattern.base': 'Please enter a valid Gmail address',
        }),
    password: Joi.string().required(),
    role:Joi.string()
});


const userloginValidator = Joi.object({
    email: Joi.string()
    .regex(gmail)
    .required()
    .messages({
        'any.required': 'Email is required',
        'string.pattern.base': 'Please enter a valid Gmail address',
    }),
    password:Joi.string().required(),
    role:Joi.string().default('client')
});

module.exports = {
    userRegisterValidator, userloginValidator
};
