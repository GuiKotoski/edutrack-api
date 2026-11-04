const studentService = require("../services/studentService");

const getStudents = (req, res) => {
  const students = studentService.getAllStudents();

  return res.status(200).json(students);
};

module.exports = {
  getStudents,
};