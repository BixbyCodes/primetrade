const { body } = require("express-validator");

exports.registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }).withMessage("Name max 50 chars"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
