const teacherService = require("../services/teacherService");

const getTeachers = (req, res) => {
  const teachers = teacherService.getAllTeachers();

  return res.status(200).json(teachers);
};

module.exports = {
  getTeachers,
};