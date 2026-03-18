    const app = require("../src/app");
const connectDB = require("../src/config/db");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("MongoDB connected");
  }

  return app(req, res);
};