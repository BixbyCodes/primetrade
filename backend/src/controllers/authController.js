const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

exports.register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array().map((e) => e.msg)));
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return next(new ApiError(409, "Email already registered"));

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, "Registration successful")
  );
});

exports.login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array().map((e) => e.msg)));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  if (!user.isActive) return next(new ApiError(401, "Account deactivated. Contact support."));

  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, "Login successful")
  );
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    }, "Profile fetched")
  );
});
