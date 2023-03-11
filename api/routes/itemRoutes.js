// const express = require("express");
// const router = express.Router();
// const ItemModel = require("../models/itemModel");
// const cheerio = require("cheerio");
// const axios = require("axios");
// const itemObject = [];

//New Item To track
// router.post("/addItem", async (req, res) => {
//   const prodURL = req.body.productURL;

//   const item = new ItemModel({
//     userEmail: req.body.userEmail,
//     productURL: itemObject.productURL,
//     productName: itemObject.productName,
//     productPriceUsed: itemObject.productPriceUsed,
//   });
//   try {
//     const saveItem = await item.save();
//     res.status(200).json(saveItem);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// module.exports = router;
