const { validationResult } = require("express-validator");
const Task = require("../models/Task.js");

const taskCntrl = {};
taskCntrl.create = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category, status, priority, dueDate } =
      req.body;

    const newTask = new Task({
      title,
      description,
      category,
      status,
      priority,
      dueDate,
      user: req.user.id,
    });

    const task = await newTask.save();
    res.json({ msg: "New Task created by successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

taskCntrl.singleUserAllTask = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = { user: req.user.id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ msg: "All Tasks fetched successfully", tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

taskCntrl.singleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

taskCntrl.updateTask = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        errors: [{ msg: "Task Not Found" }],
      });
    }

    // Update task fields
    const { title, description, category, status, priority, dueDate } =
      req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (category) task.category = category;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    task = await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

taskCntrl.deleteTask = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        errors: [{ msg: "Task Not Found" }],
      });
    }

    await task.deleteOne();
    res.json({ msg: "Task removed", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = taskCntrl;
