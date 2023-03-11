//addItem.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const itemModel = require("../models/itemModel");

router.post("/addItem", async (req, res) => {
  const productURL = req.body.productURL;
  const userEmail = req.body.userEmail;

  let payload = { userEmail: userEmail, productURL: productURL };

  let response = await axios.post(
    "http://localhost:3000/app/getItemData",
    payload
  );

  const itemObject = new itemModel({
    userEmail: response.data.userEmail,
    productURL: response.data.productURL,
    prodImg: response.data.prodImg,
    productName: response.data.productName,
    fullPrice: response.data.fullPrice,
    productPriceUsed: response.data.productPriceUsed,
  });

  try {
    const saveItem = await itemObject.save();
    res.status(200).json(saveItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
