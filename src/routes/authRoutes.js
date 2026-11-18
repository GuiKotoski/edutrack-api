const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const validate = require("../middleware/validate");
const authRateLimit = require("../middleware/authRateLimit");

const {
  registerSchema,
  loginSchema,
} = require("../schemas/auth.schema");

router.post(
  "/register",
  authRateLimit,
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  authRateLimit,
  validate(loginSchema),
  authController.login
);

module.exports = router;
