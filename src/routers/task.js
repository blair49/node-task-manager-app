const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const taskRouter = new express.Router();

/**
 * GET /tasks/?completed=true
 * GET /tasks/?limit=10&skip=20
 * GET /tasks/?sortBy=createdAt_asc
 */
taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  const sort = {};
  if (req.query.sortBy) {
    const keyValue = req.query.sortBy.split("_");
    if (keyValue.length >= 2);
    sort[keyValue[0]] = keyValue[1] === "asc" ? 1 : -1;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = requestedUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) return res.status(400).send({ error: "Invalid Updates" });
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    requestedUpdates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

taskRouter.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    const result = await task.save();
    res.send(result);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = taskRouter;
