const Joi = require('@hapi/joi');
const {validate} = require("../../utils/validate");

const login = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
};

const changePassword = {
    body: Joi.object({
        _id: Joi.string().required(),
        password: Joi.string().required(),
        currentPassword: Joi.string().required(),
    })
};

module.exports = {
    loginValidation: validate(login),
    changePasswordValidation: validate(changePassword)
}
