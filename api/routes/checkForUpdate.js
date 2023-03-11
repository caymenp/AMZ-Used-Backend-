const express = require("express");
const axios = require("axios");
const itemModel = require("../models/itemModel");
const { json } = require("body-parser");

async function testing() {
  const totalDocs = await itemModel.countDocuments();

  for await (const doc of itemModel.find()) {
    const prodID = doc._id;
    const productName = doc.productName;
    const prodURL = doc.productURL;
    const usedPriceArray = doc.productPriceUsed;
    let lastItem = usedPriceArray[usedPriceArray.length - 1];

    let payload = { _id: prodID, productURL: prodURL };
    let response = await axios.post(
      "http://localhost:3000/app/refreshItem",
      payload
    );

    let totalIndex = response.data.productPriceUsed.length;
    let newPrice = response.data.productPriceUsed[totalIndex - 1].usedPrice;

    if (newPrice < lastItem.usedPrice) {
      console.log("New price is the lower");
    } else if (newPrice === lastItem.usedPrice) {
      console.log("Prices are the same");
    } else {
      console.log("New price is higher");
    }
  }
}

module.exports = { testing };
