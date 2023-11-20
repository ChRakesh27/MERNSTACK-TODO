const todoRoutes = require("../controllers/todo.controller");

const express = require("express");
const router = express.Router();

router.use("/todos", todoRoutes);

module.exports = router;
