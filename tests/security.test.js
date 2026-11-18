const request = require("supertest");
const app = require("../src/app");

describe("Authentication security controls", () => {
  it("limits repeated failed authentication requests by IP", async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request(app).post("/auth/login").send({
        email: "invalid",
        password: "short",
      });
      expect(response.statusCode).toBe(400);
    }

    const limited = await request(app).post("/auth/login").send({
      email: "invalid",
      password: "short",
    });

    expect(limited.statusCode).toBe(429);
    expect(limited.headers["retry-after"]).toBeDefined();
  });
});
