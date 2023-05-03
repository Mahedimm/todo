const express = require("express");
const ApiError = require("./../utils/ApiError");
const apiResponse = require("../utils/apiResponse");
const httpStatus = require("http-status");

const router = express.Router();

const guestRoute = require("./guest.route");

// Backend

// Frontend
const feAuthRoute = require("./frontEnd/auth.route");
const feUtilitiesRoute = require("./frontEnd/utilities.route");
const feTodoRoute = require("./frontEnd/todo.route");

router.use("/", guestRoute);

// Backend

// Frontend
router.use("/front-end/auth", feAuthRoute);
router.use("/front-end/utilities", feUtilitiesRoute);
router.use("/front-end/todo", feTodoRoute);



// send back a 404 error for any unknown api request
router.use((req, res, next) => {
    const error = new ApiError(httpStatus.NOT_FOUND);
    return next(error);
});

// convert error to ApiError, if needed
router.use((error, req, res, next) => {
    const status = error.statusCode || res.statusCode || 500;
    // const stack = process.env.NODE_ENVIRONMENT !== "production" ? error.stack : {};
    const stack = error.stack;

    return apiResponse(res, status, error.message, stack);
});

module.exports = router;
