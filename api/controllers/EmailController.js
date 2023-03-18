const mailgun = require("mailgun-js");
require("dotenv").config({ path: "db/email.env" });

const DOMAIN = process.env.DOMAIN;
const API_KEY = process.env.API_KEY;
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

async function sendEmail(emailData) {
  try {
    await mg.messages().send(emailData, function (error, body) {
      if (error) console.log(error);
      else console.log(body);
    });
  } catch (error) {
    console.log("Error Sending Email");
    console.log(error);
    if (error.response) {
      console.log(error.resonse.body);
    }
  }
}
module.exports = { sendEmail };
