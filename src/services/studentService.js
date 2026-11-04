const students = [
  {
    id: 1,
    name: "João Santos",
    age: 15,
  },
];

const getAllStudents = () => students;

const getStudentById = (id) => {
  return students.find(
    (student) => student.id === id
  );
};

module.exports = {
  getAllStudents,
  getStudentById,
};