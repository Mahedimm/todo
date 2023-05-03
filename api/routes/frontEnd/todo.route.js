const express = require("express");
const router = express.Router();
const { isAuthenticated} = require("./../../middlewares/auth.middleware");
const {addTodo, getTodos, updateTodo, deleteTodo} = require("../../controllers/frontEnd/todo.controller");



router.post("/add-todo", isAuthenticated,  addTodo)
router.get("/todos", isAuthenticated,  getTodos)
router.put("/update-todo/:id", isAuthenticated,  updateTodo)
router.delete("/delete-todo/:id", isAuthenticated,  deleteTodo)

module.exports = router;
