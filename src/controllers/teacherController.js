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
      return res.status(404).json({
        error: "Teacher not found",
      });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    const students = await teacherService.getTeacherStudents(
      req.params.id
    );

    res.json(students);
  } catch (error) {
    if (error.message === "Teacher not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};

const addStudentToTeacher = async (req, res) => {
  try {
    const student =
      await teacherService.addStudentToTeacher(
        req.params.id,
        req.body
      );

    res.status(201).json(student);
  } catch (error) {
    if (
      error.message === "Teacher not found" ||
      error.message === "Name and age are required"
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacher = await teacherService.createTeacher(
      req.body
    );

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher =
      await teacherService.updateTeacher(
        req.params.id,
        req.body
      );

    res.json(teacher);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    await teacherService.deleteTeacher(
      req.params.id
    );

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
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