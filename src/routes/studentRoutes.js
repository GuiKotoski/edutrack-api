const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const authenticateToken = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { z } = require("zod");
const { studentSchema, updateStudentSchema } = require("../schemas/student.schema");
const idSchema = z.object({ id: z.coerce.number().int().positive() });

router.get(
  "/",
  authenticateToken,
  studentController.getAllStudents
);

router.get(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  studentController.getStudentById
);

router.post(
  "/",
  authenticateToken,
  validate(studentSchema),
  studentController.createStudent
);

router.put(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.delete(
  "/:id",
  authenticateToken,
  validate(idSchema, "params"),
  studentController.deleteStudent
);

module.exports = router;
