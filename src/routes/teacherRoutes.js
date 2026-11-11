const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const authenticateToken = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticateToken,
  teacherController.getAllTeachers
);

router.get(
  "/:id",
  authenticateToken,
  teacherController.getTeacherById
);

router.post(
  "/",
  authenticateToken,
  teacherController.createTeacher
);

router.put(
  "/:id",
  authenticateToken,
  teacherController.updateTeacher
);

router.delete(
  "/:id",
  authenticateToken,
  teacherController.deleteTeacher
);

module.exports = router;