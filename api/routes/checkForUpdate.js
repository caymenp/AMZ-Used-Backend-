const axios = require("axios");
const itemModel = require("../models/itemModel");

async function scheduledRefresh() {
  console.log("Function: 'Scheduled Refresh' Starting!");
  let allItems = await itemModel.find();
  for (const item of allItems) {
    let payload = {
      _id: item._id,
      productURL: item.productURL,
      userEmail: item.userEmail,
      recentPrice:
        item.productPriceUsed[item.productPriceUsed.length - 1].usedPrice,
    };
    await axios
      .post("https://api.amzused.com/app/refreshItem", payload)
      .then((response) => {
        console.log("Updating");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("going to next");
  }
}

module.exports = { scheduledRefresh };
