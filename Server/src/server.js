const http = require("http");

const app = require("./app");
const { loadPlanets } = require("./model/planets.model");
const { connectMongo } = require("./services/mongo");
const { loadLaunchesData } = require("./model/launches.model");

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanets();
  await loadLaunchesData();
  server.listen(process.env.PORT || 4000, () => {
    console.log(`Application Running on PORT: ${process.env.PORT}`);
  });
}

startServer();
