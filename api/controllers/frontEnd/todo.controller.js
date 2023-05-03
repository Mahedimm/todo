const httpStatus = require("http-status");
const mongoose = require("mongoose");

const token = require("../../utils/token");
const catchAsync = require("../../utils/catchAsync");
const apiResponse = require("../../utils/apiResponse");
const validationError = require("../../utils/validationError");

const {TodoModel, TodoStatus} = require("../../models/feTodo");

const addTodo = catchAsync(async (req, res) => {
    console.log(req.body);
    console.log("here")
    const {title, description, priority, status} = req.body;

    const newTodo = new TodoModel({
        title,
        description,
        priority,
        status
    });
    const err = newTodo.validateSync();

    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {message: "Validation Required"}, validation);
    }

    const save  = await newTodo.save();
    return apiResponse(res, httpStatus.CREATED, {data: save, message: "todo Created"});
});

const getTodos = catchAsync(async (req, res) => {

    let filters = { status: {$ne: TodoStatus.deleted} };

    if (req.query.status) {
        filters = { ...filters, status: req.query.status };
    }

    const todos = await TodoModel
        .find(filters)
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({createdAt: -1})

    const total = await TodoModel.countDocuments({status: {$ne: TodoStatus.deleted}});
    const response = {page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: todos};

    return apiResponse(res, httpStatus.OK, {data: response, message: "todos"});
});

const updateTodo = catchAsync(async (req, res) => {
    const userId = await token.getAccessTokenFeUserId(req);
    if (!userId) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Invalid user."})

    const {title , description, priority, status} = req.body;

    const todo = await TodoModel.findOne({_id: req.params.id});
    if (!todo) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Invalid todo."})

    const update =  await TodoModel.updateOne({_id: req.params.id}, {title, description, priority, status});
    return apiResponse(res, httpStatus.ACCEPTED, {data: update, message: "todo updated"});
});

const deleteTodo = catchAsync(async (req, res) => {
    await TodoModel.updateOne({_id: req.params.id}, {status: TodoStatus.deleted});
    return apiResponse(res, httpStatus.OK, {message: "todo deleted"});
});


module.exports = {
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo
};
