const { faker } = require("@faker-js/faker");

function makeTeacher(overrides = {}) {
  return {
    name: faker.person.fullName(),
    subject: faker.helpers.arrayElement([
      "Mathematics",
      "Science",
      "History",
      "Portuguese",
    ]),
    ...overrides,
  };
}

module.exports = { makeTeacher };
