const request = require("supertest");
const app = require("../../app");
const { connectMongo, disConnectMongo } = require("../../services/mongo");
const {addNewLaunch} = require('../launches/launches.controller');


// For Get Routes
describe("Testing API for Launches", () => {
  beforeAll(async () => {
    await connectMongo();
    await addNewLaunch();
  });

  // afterAll(async () => {
  //   await disConnectMongo();
  // });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      let response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  // For Post Routes
  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "Mission 1",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
      launchDate: "January 3, 2028",
    };

    const launchDataWithoutDate = {
      mission: "Mission 1",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
    };

    const launchDataWithWrongDate = {
      mission: "Mission 1",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
      launchDate: "wrong Date",
    };

    test("It should respond with 201 success", async () => {
      let response = await request(app)
        .post("/v1/launches")
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
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "All Fields are required!",
      });
    });

    test("It should respond with 400 error", async () => {
      let response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithWrongDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({ error: "Date is not valid" });
    });
  });
});
