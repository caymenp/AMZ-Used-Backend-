const express = require("express");
const router = express.Router();
const itemModel = require("../models/itemModel");

router.delete("/deleteItem", async (req, res) => {
  const productID = req.query._id;
  try {
    const deleteItem = await itemModel.findByIdAndRemove({ _id: productID });
    res.status(200).json(deleteItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
