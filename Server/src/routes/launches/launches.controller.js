const { launches, launchExists,createLaunch,abortLaunchById } = require("../../model/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()));
}

function addNewLaunch(req, res) {
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
  createLaunch(launch);
  return res.status(201).json(launch);
}

function abortLaunch(req,res){
  const launchId = Number(req.params.id);

  if(!launchExists(launchId)){
    return res.status(404).json({
      error: 'Launch not found'
    })
  }
  const abort = abortLaunchById(launchId);
  return res.status(200).json(abort);
}


module.exports = { getAllLaunches, addNewLaunch,abortLaunch };
