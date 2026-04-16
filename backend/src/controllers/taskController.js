const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator");

exports.createTask = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array().map((e) => e.msg)));
  }

  const task = await Task.create({ ...req.body, owner: req.user._id });
  res.status(201).json(new ApiResponse(201, { task }, "Task created"));
});

exports.getTasks = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Task.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      tasks,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    }, "Tasks fetched")
  );
});

exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) return next(new ApiError(404, "Task not found"));
  res.status(200).json(new ApiResponse(200, { task }, "Task fetched"));
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array().map((e) => e.msg)));
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) return next(new ApiError(404, "Task not found"));
  res.status(200).json(new ApiResponse(200, { task }, "Task updated"));
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) return next(new ApiError(404, "Task not found"));
  res.status(200).json(new ApiResponse(200, {}, "Task deleted"));
});
