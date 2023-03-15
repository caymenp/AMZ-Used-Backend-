const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  productURL: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  prodImg: {
    type: String,
    required: true,
  },
  fullPrice: {
    type: Number,
    required: true,
  },
  productPriceUsed: [
    {
      usedPrice: {
        type: Number,
        required: true,
      },
      dateTracker: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", itemSchema);
