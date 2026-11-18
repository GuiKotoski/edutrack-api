const teacherService = require("../services/teacherService");

const getAllTeachers = async (req, res) => res.json(await teacherService.getAllTeachers(req.user.id));

const getTeacherById = async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id, req.user.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  return res.json(teacher);
};

const getTeacherStudents = async (req, res) =>
  res.json(await teacherService.getTeacherStudents(req.params.id, req.user.id));

const addStudentToTeacher = async (req, res) =>
  res.status(201).json(await teacherService.addStudentToTeacher(req.params.id, req.body, req.user.id));

const createTeacher = async (req, res) =>
  res.status(201).json(await teacherService.createTeacher(req.body, req.user.id));

const updateTeacher = async (req, res) =>
  res.json(await teacherService.updateTeacher(req.params.id, req.body, req.user.id));

const deleteTeacher = async (req, res) => {
  await teacherService.deleteTeacher(req.params.id, req.user.id);
  return res.status(204).send();
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  getTeacherStudents,
  addStudentToTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
