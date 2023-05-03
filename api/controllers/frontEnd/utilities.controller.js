const httpStatus = require("http-status");

const catchAsync = require("../../utils/catchAsync");
const apiResponse = require("../../utils/apiResponse");

const {RoleModel, RoleStatus} = require("../../models/beRole.model");
const {UserModel, UserStatus} = require("../../models/feUser.model");

const getRoles = catchAsync(async (req, res) => {
    const roles = await RoleModel.find({ status: { $eq: RoleStatus.active } });
    return apiResponse(res, httpStatus.OK, {data: roles});
});

const getUsers = catchAsync(async (req, res) => {
    const users = await UserModel.find({ status: { $eq: UserStatus.active } }, {firstName: true, lastName: true, photo: true, email: true, phone: true});
    return apiResponse(res, httpStatus.OK, {data: users});
});

const addRole = catchAsync(async (req, res) => {
    return apiResponse(res, httpStatus.CREATED, {data: null, message: "New role created!"});
});

module.exports = {
    getRoles, getUsers, addRole
};
