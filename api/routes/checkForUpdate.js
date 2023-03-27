const axios = require("axios");
const itemModel = require("../models/itemModel");

async function scheduledRefresh() {
  //Getting All Documents from Mongo Collection
  let allItems;
  try {
    allItems = await itemModel.find();
  } catch (err) {
    console.log("Mongo Error: ", err);
  }

  //Looping through items from Mongo Collection

  for (let i = 0; i < allItems.length; i++) {
    //Setting Payload Data for POST req to /refreshItem
    const payload = {};
    (payload._id = allItems[i]._id.toString()),
      (payload.productURL = allItems[i].productURL),
      (payload.userEmail = allItems[i].userEmail),
      (payload.recentPrice =
        allItems[i].productPriceUsed[
          allItems[i].productPriceUsed.length - 1
        ].usedPrice);

    //Making Post Req
    try {
      console.log(`PAYLOAD ${i}: `, payload);
      await axios
        .post("https://api.amzused.com/app/refreshItem", payload)
        .then((res) => {
          if (res.status === 200) {
            console.log("Success from checkForUpdate");
          }
        });
    } catch (error) {
      console.log("Error in checkForUpdate: ", error);
    }
  }
}

module.exports = { scheduledRefresh };
