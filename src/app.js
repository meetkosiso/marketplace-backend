// import dependencies
import "babel-polyfill";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";

// import routes
import api from "./api";

dotenv.config();
// process.env.NODE_ENV = "production";

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

const env = process.env.NODE_ENV;
const PORT = process.env.BACKEND_PORT;
let database = process.env.DB_HOST;

if (env === "development") {
  database = process.env.DB_HOST;
}

// Configuring the database
mongoose.Promise = global.Promise;


// Connecting to the database
mongoose.connect(database, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to the database!");
  }).catch((err) => {
    console.log(err, "Could not connect to the database. Exiting now...");
    process.exit();
  });

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bezop Marketplace API." });
});

// modify request object
app.use((req, res, next) => {
  res.locals.userId = 0.0;
  res.locals.userType = "anonymous";
  res.locals.role = "";
  next();
});

// Use Routes
app.use("/api/v1", api);

app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: `BEZOP Marketplace API says ${error.message}`,
    },
  });
  next();
});

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
