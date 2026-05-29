const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  shortUrl: String,
  clicks: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Url", urlSchema);