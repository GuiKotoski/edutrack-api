const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("should return api status", async () => {
    const response = await request(app).get("/");

    console.log(response.text);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "EduTrack API Online",
    });
  });
});

