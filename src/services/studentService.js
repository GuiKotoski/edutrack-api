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
  updateStudent,
  deleteStudent,
};