const Joi = require('@hapi/joi');
const {validate} = require("../../utils/validate");

const login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
};

const register = {
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(11).required(),
        gender: Joi.string().required(),
        password: Joi.string().min(6).required()
    })
};

const renew = {
    body: Joi.object({
        access: Joi.string().required(),
        refresh: Joi.string().required(),
    })
};

const otpVerify = {
    body: Joi.object({
        otp: Joi.string().required(),
        userId: Joi.string().required(),
        phone: Joi.string().required(),
    })
};

const otpResend = {
    body: Joi.object({
        userId: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        resendBy: Joi.string().required(),
    })
};

const lostPassword = {
    body: Joi.object({
        email: Joi.string().required()
    })
}

const resetPassword = {
    body: Joi.object({
        _id: Joi.string().required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required()
    })
}

module.exports = {
    loginValidation: validate(login),
    registerValidation: validate(register),
    renewValidation: validate(renew),
    otpVerifyValidation: validate(otpVerify),
    otpResendValidation: validate(otpResend),
    lostPasswordValidation: validate(lostPassword),
    resetPasswordValidation: validate(resetPassword),
}
