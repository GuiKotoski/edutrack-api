const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("should return api status", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "EduTrack API Online",
    });
  });

  it("should return a JSON 404 for unknown routes", async () => {
    const response = await request(app).get("/missing-route");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Route not found" });
  });

});

