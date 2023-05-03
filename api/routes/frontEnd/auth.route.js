const express = require("express");
const router = express.Router();
const {isClientAuthenticated, isAuthenticated} = require("./../../middlewares/auth.middleware");
const {
    login,
    register,
    renew,
    logout,
    lostPassword,
    resetPassword,
} = require("./../../controllers/frontEnd/auth.controller");
const {
    loginValidation,
    registerValidation,
    renewValidation,
    lostPasswordValidation,
    resetPasswordValidation,
} = require("../../validations/frontEnd/auth.validation");

router.post("/login", isClientAuthenticated, loginValidation, login)
router.delete("/logout", isAuthenticated, logout)
router.post("/renew", isClientAuthenticated, renewValidation, renew)
router.post("/register", isClientAuthenticated, registerValidation, register)
router.post("/lost-password", isClientAuthenticated, lostPasswordValidation, lostPassword)
router.post("/reset-password", isClientAuthenticated, resetPasswordValidation, resetPassword)

module.exports = router;
