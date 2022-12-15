const launches = new Map();

let currentflightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 30", "2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function launchExists(launchId) {
  return launches.has(launchId);
}

function createLaunch(launch) {
  currentflightNumber++;
  launches.set(
    currentflightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customers: ["ZTM", "NASA"],
      flightNumber: currentflightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = { launches, launchExists, createLaunch,abortLaunchById };
