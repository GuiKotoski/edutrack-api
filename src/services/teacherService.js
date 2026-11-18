const prisma = require("../config/prisma");

const getAllTeachers = async (ownerId) => {
  return prisma.teacher.findMany({ where: { ownerId } });
};

const getTeacherById = async (id, ownerId) => {
  return prisma.teacher.findUnique({
    where: {
      id: Number(id),
      ownerId,
    },
    include: {
      students: { where: { ownerId } },
    },
  });
};

const createTeacher = async ({ name, subject }, ownerId) => {
  return prisma.teacher.create({
    data: {
      name,
      subject,
      ownerId,
    },
  });
};

const updateTeacher = async (id, data, ownerId) => {
  return prisma.teacher.update({
    where: {
      id: Number(id),
      ownerId,
    },
    data,
  });
};

const deleteTeacher = async (id, ownerId) => {
  return prisma.teacher.delete({
    where: {
      id: Number(id),
      ownerId,
    },
  });
};

const getTeacherStudents = async (id, ownerId) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(id),
      ownerId,
    },
    include: {
      students: { where: { ownerId } },
    },
  });

  if (!teacher) {
    const error = new Error("Teacher not found");
    error.statusCode = 404;
    throw error;
  }

  return teacher.students;
};

const addStudentToTeacher = async (teacherId, studentData, ownerId) => {
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
      name: studentData.name,
      age: Number(studentData.age),
      teacherId: Number(teacherId),
      ownerId,
    },
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherStudents,
  addStudentToTeacher,
};
