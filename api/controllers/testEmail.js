const { sendEmail } = require("./EmailController");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/newPriceAlert.hbs"),
  "utf8"
);
const template = handlebars.compile(emailTemplateSource);
const htmlToSend = template({ productName: "Macbook Pro", newPrice: "$19.99" });

const data = {
  from: "AMZ-Used <noreply@app.amzused.com>",
  to: "caymenpope10@gmail.com",
  subject: "Lower Price Alert-We Found A New Listing On Amazon!",
  html: htmlToSend,
};
sendEmail(data);
