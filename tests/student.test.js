const request = require("supertest");

const app = require("../src/app");

describe("Student Endpoints", () => {
  it("should return all students", async () => {
    const response = await request(app)
      .get("/students");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);
  });

  it("should return one student", async () => {
    const response = await request(app)
      .get("/students/1");

    expect(response.statusCode).toBe(200);

    expect(response.body.id).toBe(1);
  });
});