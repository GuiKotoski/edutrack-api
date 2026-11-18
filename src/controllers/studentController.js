const studentService = require("../services/studentService");

const getAllStudents = async (req, res) => res.json(await studentService.getAllStudents(req.user.id));

const getStudentById = async (req, res) => {
  const student = await studentService.getStudentById(req.params.id, req.user.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  return res.json(student);
};

const createStudent = async (req, res) =>
  res.status(201).json(await studentService.createStudent(req.body, req.user.id));

const updateStudent = async (req, res) =>
  res.json(await studentService.updateStudent(req.params.id, req.body, req.user.id));

const deleteStudent = async (req, res) => {
  await studentService.deleteStudent(req.params.id, req.user.id);
  return res.status(204).send();
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
