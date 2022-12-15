const { getAllLaunches, addNewLaunch,abortLaunch } = require("./launches.controller");

const launchesRouter = require("express").Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", addNewLaunch);
launchesRouter.delete('/:id',abortLaunch);
module.exports = { launchesRouter };
