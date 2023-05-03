const passportJwt = require("passport-jwt");
const catchAsync = require("../utils/catchAsync");
const {UserModel: BeUserModel} = require("../models/beUser.model");
const {UserModel: FeUserModel} = require("../models/feUser.model");

const passportJwtInit = new passportJwt.Strategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET
}, catchAsync(async (jwt_payload, done) => {
    if (!jwt_payload.platform)
        return done(true, false);

    let user = null;

    if (jwt_payload.platform === 'frontEnd')
        user = await FeUserModel.findOne({_id: jwt_payload.sub._id});
    else if (jwt_payload.platform === 'backEnd')
        user = await BeUserModel.findOne({_id: jwt_payload.sub._id});
    else
        return done(true, false);

    if (!user)
        return done(true, false);

    return done(false, user, jwt_payload);
}));

module.exports = passportJwtInit;
