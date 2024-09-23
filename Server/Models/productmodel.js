const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: [true, "Title is required."],
  },
  desc: {
    type: "string",
    required: [true, "Description is required."],
  },
  price: {
    type: "number",
    required: [true, "Price is required."],
  },
  imageurl: {
    type: "string",
    required: [true, "Image url is required."],
  },
});

module.exports = mongoose.model("products", productSchema);
