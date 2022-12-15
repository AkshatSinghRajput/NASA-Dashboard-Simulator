const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");

const habitablePlanet = [];

const inhabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

// The pipe function connects the readable stream to writable stream
function loadPlanets(){
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
          habitablePlanet.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        resolve();
        console.log("Session Ended");
      });
   
  });
};

module.exports = { loadPlanets, planets: habitablePlanet };
