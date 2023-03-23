const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "db/db.env" });
const middleware = require("./api/routes");
const cors = require("cors");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const cron = require("node-cron");
const scheduledRefresh =
  require("./api/routes/checkForUpdate").scheduledRefresh;

const app = express();

//MongoDB Connection
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

//Node to serve files from REACT client
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/app", middleware);

//Handles App Errors
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

app.listen(3000, () => {
  console.log(`Server Started on port: 3000`);
});

cron.schedule(
  "0 2 * * *",
  () => {
    console.log("Starting scheduled job!");
    scheduledRefresh();
  },
  {
    scheduled: true,
    timezone: "America/Chicago",
  }
);

cron.schedule(
  "30 13 * * *",
  () => {
    console.log("Starting scheduled job!");
    scheduledRefresh();
  },
  {
    scheduled: true,
    timezone: "America/Chicago",
  }
);
