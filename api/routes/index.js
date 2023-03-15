const express = require("express");
const router = express.Router();
const item = require("./addItem");
const getItemData = require("./getItemData");
const userItems = require("./userItems");
const deleteItem = require("./deleteItem");
const refreshItem = require("./refreshItem");
const itemDetail = require("./itemDetail");

//Item Routes
router.post("/addItem", item);
router.post("/getItemData", getItemData);
router.get("/userItems", userItems);
router.delete("/deleteItem", deleteItem);
router.post("/refreshItem", refreshItem);
router.get("/itemDetail", itemDetail);

module.exports = router;
