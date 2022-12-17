const launchDatabase = require("./launches.mongo");
const planetDataBase = require("./planets.mongo");

const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("11/06/2024"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
createLaunch(launch);

function launchExists(launchId) {
  return launchDatabase.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function createLaunch(launch) {
  const planet = await planetDataBase.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Invalid Planet");
  }
  await launchDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
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

module.exports = {
  getLaunches,
  launchExists,
  scheduleNewLaunch,
  abortLaunchById,
};
