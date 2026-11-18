const prisma = require("../config/prisma");

const getAllStudents = async (ownerId) => {
  return prisma.student.findMany({ where: { ownerId } });
};

const getStudentById = async (id, ownerId) => {
  return prisma.student.findUnique({
    where: {
      id: Number(id),
      ownerId,
    },
  });
};

const createStudent = async ({ name, age }, ownerId) => {
  return prisma.student.create({
    data: {
      name,
      age,
      ownerId,
    },
  });
};

const createStudentForTeacher = async (
  teacherId,
  { name, age },
  ownerId,
) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(teacherId),
      ownerId,
    },
  });

  if (!teacher) {
    const error = new Error("Teacher not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.student.create({
    data: {
      name,
      age,
      teacherId: Number(teacherId),
      ownerId,
    },
  });
};

const updateStudent = async (id, data, ownerId) => {
  return prisma.student.update({
    where: {
      id: Number(id),
      ownerId,
    },
    data,
  });
};

const deleteStudent = async (id, ownerId) => {
  return prisma.student.delete({
    where: {
      id: Number(id),
      ownerId,
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
