const express = require("express");
const router = express.Router();
const axios = require("axios");
const itemModel = require("../models/itemModel");
const {
  priceAlertController,
} = require("../../emailControllers/priceAlertController");

router.post("/refreshItem", async (req, res) => {
  const prodID = req.body._id;
  const prodURL = req.body.productURL;
  const recentPrice = req.body.recentPrice;
  const userEmail = req.body.userEmail;
  let payload = { userEmail: userEmail, productURL: prodURL };

  let response = await axios.post(
    "https://api.amzused.com/app/getItemData",
    payload
  );

  let productName = response.data.productName;
  let fullPrice = response.data.fullPrice;
  let productPriceUsed = response.data.productPriceUsed;
  let prodImg = response.data.prodImg;

  if (productPriceUsed[0].usedPrice < recentPrice) {
    //SEND EMAIL ALERT IF NEWLY REPORTED PRICE IS LOWER
    priceAlertController(userEmail, productName, productPriceUsed[0].usedPrice);
  } else if (recentPrice === 0 && productPriceUsed[0].usedPrice !== 0) {
    //SEND EMAIL ALERT IF ITEM DID NOT HAVE A USED ITEM, BUT NOW DOES
    priceAlertController(userEmail, productName, productPriceUsed[0].usedPrice);
  }
  try {
    const refreshItem = await itemModel.findByIdAndUpdate(
      { _id: prodID },
      { $push: { productPriceUsed: productPriceUsed } },
      { returnDocument: "after" }
    );
    res.status(200).json(refreshItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
