const passport = require("passport");
const httpStatus = require("http-status");
const moment = require("moment");

const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/ApiError");

const {OAuthAccessTokenModel: BeOAuthAccessTokenModel} = require("../models/beOAuthAccessToken.model");
const {OAuthRefreshTokenModel: BeOAuthRefreshTokenModel} = require("../models/beOAuthRefreshToken.model");
const {OAuthAccessTokenModel: FeOAuthAccessTokenModel} = require("../models/feOAuthAccessToken.model");
const {OAuthRefreshTokenModel: FeOAuthRefreshTokenModel} = require("../models/feOAuthRefreshToken.model");
const {UserModel} = require("../models/beUser.model");
const {RoleModel} = require("../models/beRole.model");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
    if (err || !info || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, {
            message: "Session expired. Please login again."
        });
        return reject(error);
    }

    if (info.platform) {
        if (info.platform === 'frontEnd') {
            const oAuthTokenDetail = await FeOAuthAccessTokenModel.findOne({
                _id: req.headers.authorization.split(" ")[1],
                revoked: false,
                expires: {$gte: moment().format()}
            });

            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await FeOAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail._id,
                    revoked: false,
                    expires: {$gte: moment().format()}
                });

                if (oAuthRefreshDetail) {
                    req.user = user;
                    req.access = oAuthTokenDetail;
                    req.refresh = oAuthRefreshDetail;

                    return resolve();
                }
            }
        } else if (info.platform === 'backEnd') {
            const oAuthTokenDetail = await BeOAuthAccessTokenModel.findOne({
                _id: req.headers.authorization.split(" ")[1],
                revoked: false,
                expires: {$gte: moment().format()}
            });

            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await BeOAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail._id,
                    revoked: false,
                    expires: {$gte: moment().format()}
                });

                if (oAuthRefreshDetail) {
                    req.user = user;
                    req.access = oAuthTokenDetail;
                    req.refresh = oAuthRefreshDetail;

                    return resolve();
                }
            }
        }
    }

    const error = new ApiError(httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
    return reject(error);
};

const isAuthenticated = catchAsync(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport.authenticate("jwt", {
            session: false
        }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

const clientVerifyCallback = (req, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
        const error = new ApiError(httpStatus.NOT_ACCEPTABLE, {
            message: "Invalid client."
        });
        return reject(error);
    }

    req.client = user;
    return resolve();
};

const isClientAuthenticated = catchAsync(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport.authenticate("basic", clientVerifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

const isScopePermitted = (scope) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'].split(' ');
        if (authHeader && authHeader.length > 1) {
            const accessToken = authHeader[1];
            const oAuthTokenDetail = await BeOAuthAccessTokenModel.findOne({
                _id: accessToken,
                revoked: false,
                expires: {$gte: moment().format()}
            });

            if (oAuthTokenDetail) {
                const userDetails = await UserModel.findOne({_id: oAuthTokenDetail.user});
                if (userDetails) {
                    if (userDetails.superAdmin)
                        next();
                    else {
                        const roleDetails = await RoleModel.findOne({_id: userDetails.role._id});
                        const isScope = roleDetails.permissions.find(x => x === scope);
                        if (isScope)
                            next();
                        else
                            return res.status(400).json('Access Denied');
                    }
                } else
                    return res.status(400).json('Access Denied');
            } else
                return res.status(400).json('Access Denied');
        } else
            return res.status(400).json('Access Denied');
    }
};

module.exports = {
    isAuthenticated,
    isClientAuthenticated,
    isScopePermitted
};
