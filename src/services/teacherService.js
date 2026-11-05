const prisma = require("../config/prisma");

const getAllTeachers = async () => {
  return prisma.teacher.findMany();
};

const getTeacherById = async (id) => {
  return prisma.teacher.findUnique({
    where: {
      id: Number(id),
    },
  });
};

const createTeacher = async ({ name, subject }) => {
  return prisma.teacher.create({
    data: {
      name,
      subject,
    },
  });
};

const updateTeacher = async (id, data) => {
  return prisma.teacher.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteTeacher = async (id) => {
  return prisma.teacher.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
