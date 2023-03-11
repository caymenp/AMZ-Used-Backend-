//userItems.js
const express = require("express");
const router = express.Router();
const itemModel = require("../models/itemModel");

router.get("/userItems", async (req, res) => {
  const userEmail = req.query.userEmail;
  try {
    const result = await itemModel.find({
      userEmail: userEmail,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
