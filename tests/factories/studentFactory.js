const { randomUUID } = require("node:crypto");

function makeStudent(overrides = {}) {
  const id = randomUUID().slice(0, 8);
  return {
    name: `Student ${id}`,
    age: 15,
    ...overrides,
  };
}

module.exports = { makeStudent };
