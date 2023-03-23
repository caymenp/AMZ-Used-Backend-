const express = require("express");
const router = express.Router();
const axios = require("axios");
const itemModel = require("../models/itemModel");
const {
  priceAlertController,
} = require("../../emailControllers/priceAlertController");

const saveItemUpdate = async (newData, recentPrice) => {
  const response = newData;

  let productName = response.data.productName;
  let fullPrice = response.data.fullPrice;
  let productPriceUsed = response.data.productPriceUsed;
  let prodImg = response.data.prodImg;
  let email = response.data.userEmail;

  if (productPriceUsed[0].usedPrice < recentPrice) {
    //SEND EMAIL ALERT IF NEWLY REPORTED PRICE IS LOWER
    priceAlertController(email, productName, productPriceUsed[0].usedPrice);
  } else if (recentPrice === 0 && productPriceUsed[0].usedPrice !== 0) {
    //SEND EMAIL ALERT IF ITEM DID NOT HAVE A USED ITEM, BUT NOW DOES
    priceAlertController(email, productName, productPriceUsed[0].usedPrice);
  }
  try {
    const refreshItem = await itemModel.findByIdAndUpdate(
      { _id: prodID },
      { $push: { productPriceUsed: productPriceUsed } },
      { returnDocument: "after" }
    );
    return res.status(200).json(refreshItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

router.post("/refreshItem", async (req, res) => {
  const prodID = req.body._id;
  const prodURL = req.body.productURL;
  const recentPrice = req.body.recentPrice;
  const email = req.body.userEmail;

  //Payload for Scraping API
  const payload = { userEmail: email, productURL: prodURL };

  try {
    const response = await axios.post(
      "https://api.amzused.com/app/getItemData",
      payload
    );
    const resStatus = await response.status;
    if (resStatus === 200) {
      console.log("Sending Data to SaveItemUpdate(): ", response.data);
      res = await saveItemUpdate(response.data, recentPrice);
      return res;
    }
  } catch (error) {
    console.log("Error with GetItemData: ", error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
