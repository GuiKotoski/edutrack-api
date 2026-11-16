const { faker } = require("@faker-js/faker");

function makeStudent(overrides = {}) {
  return {
    name: faker.person.fullName(),
    age: faker.number.int({ min: 10, max: 18 }),
    ...overrides,
  };
}

module.exports = { makeStudent };
