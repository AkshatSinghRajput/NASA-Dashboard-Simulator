const axios = require("axios");

const launchDatabase = require("./launches.mongo");
const planetDataBase = require("./planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 100;
let API_URL = "https://api.spacexdata.com/v4/launches/query";

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("11/06/2024"), //date_local
  target: "Kepler-442 b", //Not Applicable
  customers: ["ZTM", "NASA"], //payloads.customers
  upcoming: true, //upcoming
  success: true, //success
};

async function launchExists(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function createLaunch(launch) {
  await launchDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planetDataBase.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Invalid Planet");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await createLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

async function getLaunches() {
  return await launchDatabase.find({}, "-_id -__v");
}

async function findLaunch(filter) {
  return await launchDatabase.findOne(filter);
}

async function populateLaunches() {
  const response = await axios.post(
    API_URL,
    {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "*",
      },
    }
  );
  if (response.status !== 200) {
    console.log("Problem with downloading launches");
    throw new Error("Launch data download failed");
  }

  const launchData = response.data.docs;
  for (const lauchDoc of launchData) {
    const payloads = lauchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: lauchDoc["flight_number"],
      mission: lauchDoc["name"],
      rocket: lauchDoc["rocket"]["name"],
      launchDate: lauchDoc["date_local"],
      upcoming: lauchDoc["upcoming"],
      success: lauchDoc["success"],
      customers,
    };
    await createLaunch(launch);
  }
}

async function loadLaunchesData() {
  console.log("Loading the Launches Data");
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch Data Already Loaded");
  } else {
    await populateLaunches();
  }
}

module.exports = {
  getLaunches,
  launchExists,
  loadLaunchesData,
  scheduleNewLaunch,
  abortLaunchById,
};
