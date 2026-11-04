const request = require("supertest");
const app = require("../src/app");

describe("GET /teachers", () => {
  it("should return all teachers", async () => {
    const response = await request(app).get("/teachers");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual([
      {
        id: 1,
        name: "Carlos Silva",
        email: "carlos@email.com",
      },
    ]);
  });
});
