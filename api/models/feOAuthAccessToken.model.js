const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    user: {
        type: ObjectId,
        required: true,
        ref: "fe_user"
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    expires: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

schema.methods.isValid = function () {
    const token = this;

    return !token.revoked;
};

const model = mongoose.model("fe_o_auth_access_token", schema);
module.exports = {OAuthAccessTokenModel: model};
