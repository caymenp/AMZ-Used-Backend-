const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "db/db.env" });
const middleware = require("./api/routes");
const cors = require("cors");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const testFunction = require("./api/routes/checkForUpdate");
const cron = require("node-cron");
const scheduledRefresh = require("./api/routes/checkForUpdate");

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

// testFunction.testing();
//SendGrid setup
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "caymenpope10@gmail.com",
//   from: "app.amzused@gmail.com",
//   subject: "TEST EMAIL",
//   text: "testing email!",
//   html: "<strong>Testing this new email!</strong>",
// };

// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log(response[0].statusCode);
//     console.log(response[0].headers);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

cron.schedule("0 0 2 * * *", function () {
  scheduledRefresh();
});

cron.schedule("0 0 14 * * *", function () {
  scheduledRefresh();
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
