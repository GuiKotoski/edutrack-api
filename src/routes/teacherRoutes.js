const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const authenticateToken = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { z } = require("zod");
const { teacherSchema, updateTeacherSchema } = require("../schemas/teacher.schema");
const { studentSchema } = require("../schemas/student.schema");
const idSchema = z.object({ id: z.coerce.number().int().positive() });

router.get(
  "/",
  authenticateToken,
  teacherController.getAllTeachers
);

router.get(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  teacherController.getTeacherById
);

router.get(
  "/:id/students",
  authenticateToken,
  validate(idSchema, "params"),
  teacherController.getTeacherStudents
);

router.post(
  "/:id/students",
  authenticateToken,
  validate(idSchema, "params"),
  validate(studentSchema),
  teacherController.addStudentToTeacher
);

router.post(
  "/",
  authenticateToken,
  validate(teacherSchema),
  teacherController.createTeacher
);

router.put(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  validate(updateTeacherSchema),
  teacherController.updateTeacher
);

router.delete(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  teacherController.deleteTeacher
);

module.exports = router;
