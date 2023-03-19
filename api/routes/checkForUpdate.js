const axios = require("axios");
const itemModel = require("../models/itemModel");

async function scheduledRefresh() {
  let allItems = await itemModel.find({});

  for (const item of allItems) {
    let payload = {
      _id: item._id,
      productURL: item.productURL,
      userEmail: item.userEmail,
      recentPrice:
        item.productPriceUsed[item.productPriceUsed.length - 1].usedPrice,
    };
    let res = await axios
      .post("https://api.amzused.com/app/refreshItem", payload)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }
}
module.exports = { scheduledRefresh };
