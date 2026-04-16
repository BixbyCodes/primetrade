const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../../controllers/authController");
const { protect } = require("../../middlewares/auth");
const { registerValidator, loginValidator } = require("../../validators/auth.validator");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       201: { description: "User registered successfully" }
 *       400: { description: "Validation error" }
 *       409: { description: "Email already registered" }
 */
router.post("/register", registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200: { description: "Login successful, returns JWT" }
 *       401: { description: "Invalid credentials" }
 */
router.post("/login", loginValidator, login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "User profile" }
 *       401: { description: "Unauthorized" }
 */
router.get("/me", protect, getMe);

module.exports = router;
