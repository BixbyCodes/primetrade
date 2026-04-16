const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAllTasks, getDashboardStats } = require("../../controllers/adminController");
const { protect } = require("../../middlewares/auth");
const { requireRole } = require("../../middlewares/roleCheck");

router.use(protect, requireRole("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints (requires admin role)
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "Stats object" }
 *       403: { description: "Forbidden - admin only" }
 */
router.get("/stats", getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "List of all users" }
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/toggle:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "User status toggled" }
 */
router.patch("/users/:id/toggle", toggleUserStatus);

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks across all users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "All tasks with owner info" }
 */
router.get("/tasks", getAllTasks);

module.exports = router;
