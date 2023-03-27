const express = require("express");
const router = express.Router();
const axios = require("axios");
const itemModel = require("../models/itemModel");
const {
  priceAlertController,
} = require("../../emailControllers/priceAlertController");

const saveItemUpdate = async (newData, recentPrice, prodID) => {
  const res = newData.data;

  let productName = res.productName;
  let fullPrice = res.fullPrice;
  let productPriceUsed = res.productPriceUsed;
  let prodImg = res.prodImg;
  let email = res.userEmail;

  if (productPriceUsed[0].usedPrice < recentPrice) {
    //SEND EMAIL ALERT IF NEWLY REPORTED PRICE IS LOWER
    priceAlertController(email, productName, productPriceUsed[0].usedPrice);
  } else if (recentPrice === 0 && productPriceUsed[0].usedPrice !== 0) {
    //SEND EMAIL ALERT IF ITEM DID NOT HAVE A USED ITEM, BUT NOW DOES
    priceAlertController(email, productName, productPriceUsed[0].usedPrice);
  }
  try {
    let saveItem = await itemModel.findByIdAndUpdate(
      { _id: prodID },
      { $push: { productPriceUsed: productPriceUsed } },
      { returnDocument: "after" }
    );
    console.log(saveItem);
    return saveItem;
  } catch (error) {
    return error;
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
    await axios
      .post("https://api.amzused.com/app/getItemData", payload)
      .then((response) => {
        console.log("Got response! : ");
        const newItem = saveItemUpdate(response, recentPrice, prodID);
        return res.status(200).json(newItem);
      });
  } catch (error) {
    console.log("Error with GetItemData: ", error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
