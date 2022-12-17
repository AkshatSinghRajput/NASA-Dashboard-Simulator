const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");

const planetModel = require("../model/planets.mongo");

const inhabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

// The pipe function connects the readable stream to writable stream
function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "data.csv"))
      .pipe(
        parse({
          //options
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (inhabitablePlanet(data)) {
          createPlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        resolve();
      });
  });
}
async function getAllPlanets() {
  return await planetModel.find({}, "-_id -__v");
}

async function createPlanet(planet) {
  await planetModel.findOneAndUpdate(
    { keplerName: planet.kepler_name },
    { keplerName: planet.kepler_name },
    {
      upsert: true,
    }
  );
}

module.exports = { loadPlanets, getAllPlanets };
