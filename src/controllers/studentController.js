const studentService = require(
  "../services/studentService"
);

const getStudents = (req, res) => {
  const students =
    studentService.getAllStudents();

  return res.status(200).json(students);
};

const getStudentById = (req, res) => {
  const id = Number(req.params.id);

  const student =
    studentService.getStudentById(id);

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  return res.status(200).json(student);
};

module.exports = {
  getStudents,
  getStudentById,
};