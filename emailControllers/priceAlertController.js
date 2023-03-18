const { sendEmail } = require("../api/controllers/EmailController");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

async function priceAlertController(userEmail, prodName, prodPrice) {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "../api/templates/newPriceAlert.hbs"),
    "utf8"
  );
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ productName: prodName, newPrice: prodPrice });

  const data = {
    from: "AMZ-Used <noreply@app.amzused.com>",
    to: userEmail,
    subject: "Lower Price Alert-We Found A New Listing On Amazon!",
    html: htmlToSend,
  };

  await sendEmail(data);
}

module.exports = { priceAlertController };
