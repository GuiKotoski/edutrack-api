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

  it("should expose the OpenAPI document", async () => {
    const response = await request(app).get("/openapi.json");

    expect(response.statusCode).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/teachers/{id}/students"].post).toBeDefined();
    expect(response.body.components.securitySchemes.bearerAuth.scheme).toBe("bearer");
  });

  it("should serve Swagger UI at /docs", async () => {
    const response = await request(app).get("/docs/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });
});

