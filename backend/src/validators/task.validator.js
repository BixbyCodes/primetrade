const { body } = require("express-validator");

exports.createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title max 100 chars"),
  body("description").optional().isLength({ max: 500 }).withMessage("Description max 500 chars"),
  body("status").optional().isIn(["todo", "in-progress", "completed"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

exports.updateTaskValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 100 }),
  body("description").optional().isLength({ max: 500 }),
  body("status").optional().isIn(["todo", "in-progress", "completed"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];
