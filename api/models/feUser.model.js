const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;
const bcrypt = require("bcrypt");

const status = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

const servicesStatus = Object.freeze({
    requested: 'requested',
    rejected: 'rejected',
    approved: 'approved',
    null: null,
});

const gender = Object.freeze({
    male: 'male',
    female: 'female',
    other: 'other',
});

const otpSchema = new Schema({
    otp: { type: String, required: false, default: null },
    verified: { type: Boolean, required: false, default: false }
}, { _id : false });

const verifiedBySchema = new Schema({
    _id: { type: ObjectId, required: false, ref: 'be_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null }
}, { _id : false });

const verificationSchema = new Schema({
    verified: { type: Boolean, required: false, default: false },
    verifiedAt: { type: Date, required: false, default: null },
    verifiedBy: { type: verifiedBySchema, required: false, default: null },
}, { _id : false });

const socialSchema = new Schema({
    facebook: { type: String, required: false, default: null },
    linkedin: { type: String, required: false, default: null },
    instagram: { type: String, required: false, default: null },
    twitter: { type: String, required: false, default: null },
}, { _id : false });


const schema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: otpSchema,
        required: true,
        default: {otp: null, verified: false}
    },
    password: {
        type: String,
        required: true,
    },
    verification: {
        type: verificationSchema,
        required: true,
        default: () => ({})
    },
    gender: {
        type: String,
        enum: Object.values(gender),
        required: true,
    },
    photo: {
        type: String,
        required: false,
        default: null
    },
    overview: {
        type: String,
        required: false,
        default: null
    },
    social: {
        type: socialSchema,
        required: true,
        default: () => ({})
    },
    status: {
        type: String,
        enum: Object.values(status),
        required: true,
        default: status.active
    }
}, { timestamps: true });

schema.statics.isUnique = async function (email, phone) {
    const user = await this.findOne({$or: [{email}, {phone}]});
    if (!user) {
        return true;
    } else if (user.email === email) {
        return {email};
    } else if (user.phone === phone.toString()) {
        return {phone};
    }
    return true;
};

schema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

schema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.password;
    delete obj.status;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("fe_user", schema);
module.exports = {UserModel: model, UserGender: gender, UserStatus: status, UserServicesStatus: servicesStatus};
