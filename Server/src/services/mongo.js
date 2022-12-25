const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function disConnectMongo() {
  await mongoose.connection.close();
}

module.exports = { connectMongo, disConnectMongo };
