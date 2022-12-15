const request = require("supertest");
const app = require("../../app");

// For Get Routes
describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    let response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

// For Post Routes
describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "Mission 1",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
    launchDate: "January 3, 2028",
  };

  const launchDataWithoutDate = {
    mission: "Mission 1",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
  };

  const launchDataWithWrongDate = {
    mission: "Mission 1",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
    launchDate: "wrong Date",
  };

  test("It should respond with 201 success", async () => {
    let response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);
    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should respond with 400 error", async () => {
    let response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: "All Fields are required!" });
  });

  test("It should respond with 400 error", async () => {
    let response = await request(app)
      .post("/launches")
      .send(launchDataWithWrongDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: "Date is not valid" });
  });
});
