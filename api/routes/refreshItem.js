const express = require("express");
const router = express.Router();
const axios = require("axios");
const itemModel = require("../models/itemModel");

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

  let fullPrice = response.data.fullPrice;
  let productPriceUsed = response.data.productPriceUsed;
  let prodImg = response.data.prodImg;

  console.log("New used price", productPriceUsed[0].usedPrice);
  console.log(
    "If new price is lower: ",
    productPriceUsed[0].usedPrice < recentPrice
  );

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
