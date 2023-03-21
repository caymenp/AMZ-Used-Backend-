const axios = require("axios");
const itemModel = require("../models/itemModel");

async function makeCall(payload) {
  console.log("Sending! ", payload);
  const res = await axios
    .post("https://api.amzused.com/app/refreshItem", payload)
    .then(async (res) => {
      console.log("Waiting For Data");
      await res.data;
      console.log("Got the data!: ", res.data);
      return res.data;
    });
}

async function scheduledRefresh() {
  let allItems = await itemModel.find({});
  for (let i = 0; i < allItems.length; i++) {
    console.log("Making Payload");
    let payload = {
      _id: allItems[i]._id.toString(),
      productURL: allItems[i].productURL,
      userEmail: allItems[i].userEmail,
      recentPrice:
        allItems[i].productPriceUsed[allItems[i].productPriceUsed.length - 1]
          .usedPrice,
    };
    console.log("Sending to API function: ", payload._id);
    await makeCall(payload);
  }
}
module.exports = { scheduledRefresh };
