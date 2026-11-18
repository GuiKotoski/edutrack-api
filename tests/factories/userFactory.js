const { randomUUID } = require("node:crypto");

function makeUser(overrides = {}) {
  const id = randomUUID();
  return {
    name: `Test User ${id.slice(0, 8)}`,
    email: `user-${id}@example.com`,
    password: "123456",
    ...overrides,
  };
}

module.exports = { makeUser };
