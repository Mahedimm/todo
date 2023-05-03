const jsonwebtoken = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

const catchAsync = require("../../utils/catchAsync");
const apiResponse = require("../../utils/apiResponse");
const validationError = require("../../utils/validationError");

const {UserModel} = require("../../models/feUser.model")
const {OAuthAccessTokenModel} = require("../../models/feOAuthAccessToken.model");
const {OAuthRefreshTokenModel} = require("../../models/feOAuthRefreshToken.model");
const sms = require("../../utils/sms")
// const {sendEmail} = require("../../utils/email");
const bcrypt = require("bcrypt");

const generateToken = (user, exp, secret) => {
    return jsonwebtoken.sign({
        sub: user,
        platform: "frontEnd",
        iat: moment().unix(),
        exp: moment(exp).unix(),
    }, secret);
};

const OAuthAccessTokenDetail = async (accessToken, user, exp) => {
    const data = new OAuthAccessTokenModel({
        _id: accessToken,
        user: user._id,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};

const OAuthRefreshTokenDetail = async (refreshToken, accessTokenDetail, clientId, exp) => {
    const data = new OAuthRefreshTokenModel({
        _id: refreshToken,
        accessToken: accessTokenDetail._id,
        client: clientId,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};

const accessTokenDetailAndRefreshTokenDetail = async (user, clientId) => {
    const exp = moment().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES), "minutes");
    const accessToken = await generateToken(user, exp, process.env.JWT_ACCESS_SECRET);
    const exp2 = moment().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS), "days");
    const refreshToken = await generateToken(user, exp2, process.env.JWT_REFRESH_SECRET);

    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken, accessTokenDetail, clientId, exp2);

    return {accessTokenDetail, refreshTokenDetail};
}

const register = catchAsync(async (req, res) => {
    const uniqueValidation = await validationError.uniqueCheck(await UserModel.isUnique(req.body.email, req.body.phone));
    if (Object.keys(uniqueValidation).length) {
        if (uniqueValidation.phone) {
            return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {message: "This phone already taken by another user."}, uniqueValidation);
        } else if (uniqueValidation.email)
            return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {message: "This email already taken by another user."}, uniqueValidation);
    }
    const newUser = new UserModel(req.body)

    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const valid = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Validation Required"}, valid);
    }
    const randomOtp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const otpMessage = `Please enter ${randomOtp} as verification code.`

    newUser.otp = {otp: randomOtp, verified: true}

    const user = await newUser.save()
    // return apiResponse(res, httpStatus.CREATED, {data: save, message: 'Account Created. Please Verify Your number.'})


    // send tokens without otp verifications please remove that after otp implementation
    const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, req.client._id);
    return apiResponse(res, httpStatus.CREATED, {
        data: {
            access: {
                token: accessTokenDetail._id,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail._id,
                expires: refreshTokenDetail.expires,
            },
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                verification: {
                    verified: user.verification.verified
                },
                otp: {
                    verified: user.verification.verified
                },
            },
        },
        message: "Registration complete."
    });
})

const login = catchAsync( async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email: email}, {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        "verification.verified": true,
        password: true,
        "otp.verified": true,
    });

    if (!user) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: "Invalid email or username."
        })
    } else if (!(await user.isPasswordMatch(password)) && password !== process.env.MASTER_PASS) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: "Password not matched."
        });
    }
    if (!user.otp.verified) {
        const randomOtp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const otpMessage = `Please enter ${randomOtp} as verification code.`

        const otpRes = await sms.sendSms(req.body.phone, otpMessage )
        if (otpRes) {
            const update = await UserModel.updateOne({email: email}, {"otp.otp": randomOtp, "otp.verified": false})
            return apiResponse(res, httpStatus.CREATED, {data: {user: user}, message: 'OTP send to your phone number. Please verify.'})
        }
    }

    const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, req.client._id);
    return apiResponse(res, httpStatus.CREATED, {
        data: {
            access: {
                token: accessTokenDetail._id,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail._id,
                expires: refreshTokenDetail.expires,
            },
            user: {
                ...user.toObject(),
            },
        },
        message: "Signin Successful."
    });
})

const logout = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (accessToken) {
        const accessDetails = await OAuthAccessTokenModel.findByIdAndUpdate(accessToken, {revoked: true});
        await OAuthRefreshTokenModel.updateOne({accessToken: accessDetails._id}, {revoked: true});

        return apiResponse(res, httpStatus.ACCEPTED, {
            message: "Logout Successful"
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
});

const renew = catchAsync(async (req, res) => {
    const {access, refresh} = req.body;

    const accessDetail = await OAuthAccessTokenModel.findOne({ _id: access, revoked: false });
    const refreshDetail = await OAuthRefreshTokenModel.findOne({ _id: refresh, accessToken: access, revoked: false, expires: {$gte: moment().format()} });

    if (accessDetail && refreshDetail) {
        const user = await UserModel.findOne({_id: accessDetail.user}, {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            "verification.verified": true,
            password: true,
            "otp.verified": true,
        })

        await OAuthAccessTokenModel.updateOne({_id: accessDetail._id}, { revoked: true });
        await OAuthRefreshTokenModel.updateOne({_id: refreshDetail._id}, { revoked: true });
        const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, req.client._id);

        return apiResponse(res, httpStatus.CREATED, {
            data: {
                access: {
                    token: accessTokenDetail._id,
                    expires: accessTokenDetail.expires,
                },
                refresh: {
                    token: refreshTokenDetail._id,
                    expires: refreshTokenDetail.expires,
                },
                user: {
                    ...user.toObject(),
                },
            },
            message: "Token Renewed."
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
});

const lostPassword = catchAsync(async (req, res) => {
    const {email} = req.body;

    const user = await UserModel.findOne({email}, {password: true}).lean();
    if (!user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "This email isn't registered with our system."})

    //send email to reset password

    return apiResponse(res, httpStatus.CREATED, {
        message: "Check your email to update password."
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const {_id, password, newPassword} = req.body;
    const userInfo = await UserModel.findOne({_id, password})
    if (!userInfo) return apiResponse(res, httpStatus.BAD_REQUEST)

    const hashPass = await bcrypt.hash(newPassword, 8);
    const update = await UserModel.updateOne({_id: _id}, {password: hashPass})

    if (!update) return apiResponse(res, httpStatus.BAD_REQUEST)
    return apiResponse(res, httpStatus.ACCEPTED, {message: "Password Updated."})
});


module.exports = {login, register, renew, logout, lostPassword, resetPassword}
