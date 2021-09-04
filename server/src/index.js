const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("express-async-errors");

const { GAME_DATA_DIR } = require("./utils/constants");
const gameRouter = require("./routes/game");
const NotFoundError = require("./errors/NotFoundError");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

console.log("Starting up server...");

// load Environment variables
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

// middlewares
app.use(express.json());
app.use(cors());

// route handlers
app.use("/api/", gameRouter);

// catch any random route
app.all("*", (req, res, next) => {
  throw new NotFoundError("Resource not found");
});

// global error handler
app.use(errorHandler);

// create directory to store game data
const dir = "./" + GAME_DATA_DIR;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server up and running on port: ${port}!`);
});
