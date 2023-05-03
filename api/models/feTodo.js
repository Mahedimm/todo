const mongoose = require("mongoose");
const {Schema} = mongoose;

const status = Object.freeze({
    pending: 'pending',
    complete: 'completed',
    deleted: 'deleted',
});

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    priority: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(status),
        required: true,
    },
}, { timestamps: true });

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("fe_todo", schema);
module.exports = {TodoModel: model, TodoStatus: status};
