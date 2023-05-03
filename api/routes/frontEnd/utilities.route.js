const express = require("express");
const router = express.Router();
const {isClientAuthenticated} = require("../../middlewares/auth.middleware");

const {
    getRoles, getUsers, addRole
} = require("../../controllers/frontEnd/utilities.controller");

router.get("/roles", isClientAuthenticated, getRoles);
router.get("/users", isClientAuthenticated, getUsers);
router.post("/roles", isClientAuthenticated, addRole);

module.exports = router;
