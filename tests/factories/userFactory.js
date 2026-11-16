const { faker } = require("@faker-js/faker");

function makeUser(overrides = {}) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: "123456",
    ...overrides,
  };
}

module.exports = { makeUser };
