const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "validation-test-secret";
const app = require("../src/app");

const token = jwt.sign({ id: 1, email: "test@example.com" }, process.env.JWT_SECRET);
const withAuth = (requestBuilder) => requestBuilder.set("Authorization", `Bearer ${token}`);

describe("Request validation", () => {
  it("returns structured Zod issues for invalid teacher data", async () => {
    const response = await withAuth(request(app).post("/teachers")).send({ name: "Jo", subject: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: ["name"] }),
      expect.objectContaining({ path: ["subject"] }),
    ]));
  });

  it("validates students and student creation for a teacher", async () => {
    const standalone = await withAuth(request(app).post("/students")).send({ name: "Al", age: 15 });
    const associated = await withAuth(request(app).post("/teachers/1/students")).send({ name: "Ana", age: 0 });

    expect(standalone.status).toBe(400);
    expect(associated.status).toBe(400);
    expect(associated.body.errors[0].path).toEqual(["age"]);
  });

  it("rejects invalid route IDs with a 400 response", async () => {
    const response = await withAuth(request(app).get("/students/abc"));

    expect(response.status).toBe(400);
    expect(response.body.errors[0].path).toEqual(["id"]);
  });

  it("rejects empty update payloads", async () => {
    const response = await withAuth(request(app).put("/teachers/1")).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});
