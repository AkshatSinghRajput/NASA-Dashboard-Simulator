const {
  getLaunches,
  launchExists,
  scheduleNewLaunch,
  abortLaunchById,
} = require("../../model/launches.model");

async function getAllLaunches(req, res) {
  return res.status(200).json(await getLaunches());
}

async function addNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "All Fields are required!" });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Date is not valid" });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function abortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const exist = await launchExists(launchId);
  if (!exist) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const abort = await abortLaunchById(launchId);
  if (abort) {
    return res.status(200).json({ ok: true });
  }
  return res.status(400).json({ error: "Launch Not Aborted" });
}

module.exports = { getAllLaunches, addNewLaunch, abortLaunch };
