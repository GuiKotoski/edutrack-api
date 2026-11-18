const { randomUUID } = require("node:crypto");

function makeTeacher(overrides = {}) {
  const id = randomUUID().slice(0, 8);
  return {
    name: `Teacher ${id}`,
    subject: "Mathematics",
    ...overrides,
  };
}

module.exports = { makeTeacher };
