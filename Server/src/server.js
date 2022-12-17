const http = require("http");

const app = require("./app");
const { loadPlanets } = require("./model/planets.model");
const { connectMongo } = require("./services/mongo");

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanets();
  server.listen(process.env.PORT || 4000, () => {
    console.log(`Application Running on PORT: ${process.env.PORT}`);
  });
}

startServer();
