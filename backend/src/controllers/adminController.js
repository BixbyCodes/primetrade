const User = require("../models/User");
const Task = require("../models/Task");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { users, total: users.length }, "All users fetched"));
});

exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError(404, "User not found"));
  if (user.role === "admin") return next(new ApiError(400, "Cannot modify admin accounts"));

  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json(
    new ApiResponse(200, { user: { id: user._id, name: user.name, isActive: user.isActive } },
      `User ${user.isActive ? "activated" : "deactivated"}`)
  );
});

exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("owner", "name email").sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { tasks, total: tasks.length }, "All tasks fetched"));
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTasks, tasksByStatus] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Task.countDocuments(),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.status(200).json(
    new ApiResponse(200, { totalUsers, totalTasks, tasksByStatus }, "Dashboard stats fetched")
  );
});
