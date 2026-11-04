const teacherService = require("../services/teacherService");

const getTeachers = (req, res) => {
  return res.status(200).json(
    teacherService.getAllTeachers()
  );
};

const getTeacherById = (req, res) => {
  const id = Number(req.params.id);

  const teacher = teacherService.getTeacherById(id);

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  return res.status(200).json(teacher);
};

const createTeacher = (req, res) => {
  const teacher = teacherService.createTeacher(req.body);

  return res.status(201).json(teacher);
};

const updateTeacher = (req, res) => {
  const id = Number(req.params.id);

  const teacher = teacherService.updateTeacher(
    id,
    req.body
  );

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  return res.status(200).json(teacher);
};

const deleteTeacher = (req, res) => {
  const id = Number(req.params.id);

  const deleted = teacherService.deleteTeacher(id);

  if (!deleted) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  return res.status(204).send();
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};