const axios = require("axios");
const itemModel = require("../models/itemModel");

async function makeCall(payload) {
  const res = await axios
    .post("https://api.amzused.com/app/refreshItem", payload)
    .then((res) => {
      if (res.status === 200) return;
    })
    .catch((err) => {
      console.log("Error with API: ", err);
      return;
    });
}

async function scheduledRefresh() {
  let allItems;
  try {
    allItems = await itemModel.find();
  } catch (err) {
    console.log("Mongo Error: ", err);
  }

  let payload;
  for (let i = 0; i < allItems.length; i++) {
    payload = {
      _id: allItems[i]._id.toString(),
      productURL: allItems[i].productURL,
      userEmail: allItems[i].userEmail,
      recentPrice:
        allItems[i].productPriceUsed[allItems[i].productPriceUsed.length - 1]
          .usedPrice,
    };
    await makeCall(payload);
  }
}

module.exports = { scheduledRefresh };
