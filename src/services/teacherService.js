const teachers = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos@email.com",
  },
];

const getAllTeachers = () => teachers;

const getTeacherById = (id) =>
  teachers.find((teacher) => teacher.id === id);

const createTeacher = ({ name, email }) => {
  const newTeacher = {
    id: teachers.length + 1,
    name,
    email,
  };

  teachers.push(newTeacher);

  return newTeacher;
};

const updateTeacher = (id, data) => {
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) return null;

  teacher.name = data.name ?? teacher.name;
  teacher.email = data.email ?? teacher.email;

  return teacher;
};

const deleteTeacher = (id) => {
  const index = teachers.findIndex((t) => t.id === id);

  if (index === -1) return false;

  teachers.splice(index, 1);

  return true;
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};