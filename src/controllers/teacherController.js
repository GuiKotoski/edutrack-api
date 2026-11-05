const prisma = require("../config/prisma");
const teacherService = require("../services/teacherService"); 

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const newTeacher = await teacherService.createTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTeacher = async (req, res   ) => {
  try {
    const updatedTeacher = await teacherService.updateTeacher(req.params.id, req.body);
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    await teacherService.deleteTeacher(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

console.log({
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
});

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

