//itemDetail.js
const express = require("express");
const router = express.Router();
const itemModel = require("../models/itemModel");

router.get("/itemDetail", async (req, res) => {
  const _id = req.query._id;
  try {
    const result = await itemModel.findById({
      _id: _id,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
