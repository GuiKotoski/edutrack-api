const prisma = require("../config/prisma");

const getAllTeachers = async () => {
  return prisma.teacher.findMany();
};

const getTeacherById = async (id) => {
  return prisma.teacher.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      students: true,
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

const getTeacherStudents = async (id) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      students: true,
    },
  });

  if (!teacher) {
    const error = new Error("Teacher not found");
    error.statusCode = 404;
    throw error;
  }

  return teacher.students;
};

const addStudentToTeacher = async (
  teacherId,
  studentData
) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(teacherId),
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
