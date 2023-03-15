//emailAlert.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config({ path: "db/email.env" });

router.post("/emailAlert", async (req, res) => {
  const userEmail = req.body.userEmail;
  const productName = req.body.productName;
  const productURL = req.body.productURL;

  // SendGrid setup
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  //Actual Email Message
  const msg = {
    to: userEmail,
    from: "app.amzused@gmail.com",
    subject: "TEST EMAIL",
    text: "testing email!",
    html: "<strong>Testing this new email!</strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
});
