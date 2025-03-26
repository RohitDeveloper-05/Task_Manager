// backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { body, validationResult } = require("express-validator");
const authenticationMiddleware = require("../middleware/auth.js");
const {
  getSingleTaskValidations,
  updateTaskValidations,
  deleteTaskValidations,
  createTaskValidations,
} = require("../validators/taskValidations.js");
const taskCntrl = require("../controllers/taskController.js");

// @route   POST api/tasks
// @desc    Create a task
router.post(
  "/",
  checkSchema(createTaskValidations),
  authenticationMiddleware,
  taskCntrl.create
);

// @route   GET api/tasks
// @desc    Get all tasks for a user
router.get("/", authenticationMiddleware, taskCntrl.singleUserAllTask);

// @route   GET api/tasks/:id
// @desc    Get single task by ID
router.get(
  "/:id",
  checkSchema(getSingleTaskValidations),
  authenticationMiddleware,
  taskCntrl.singleTask
);

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put(
  "/:id",
  checkSchema(updateTaskValidations),
  authenticationMiddleware,
  taskCntrl.updateTask
);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete(
  "/:id",
  checkSchema(deleteTaskValidations),
  authenticationMiddleware,
  taskCntrl.deleteTask
);

module.exports = router;
