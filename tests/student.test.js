const request = require("supertest");
const app = require("../src/app");

describe("Student Endpoints", () => {
  describe("GET /students", () => {
  it("should return all students", async () => {
    const response = await request(app)
      .get("/students");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("age");
  });
});
});