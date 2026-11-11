const prisma = require("../config/prisma");

const getAllStudents = async () => {
  return prisma.student.findMany();
};

const getStudentById = async (id) => {
  return prisma.student.findUnique({
    where: {
      id: Number(id),
    },
  });
};

const createStudent = async ({ name, age }) => {
  return prisma.student.create({
    data: {
      name,
      age,
    },
  });
};

const createStudentForTeacher = async (
  teacherId,
  { name, age }
) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(teacherId),
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return prisma.student.create({
    data: {
      name,
      age,
      teacherId: Number(teacherId),
    },
  });
};

const updateStudent = async (id, data) => {
  return prisma.student.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteStudent = async (id) => {
  return prisma.student.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  createStudentForTeacher,
  updateStudent,
  deleteStudent,
};