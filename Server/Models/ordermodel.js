const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Name is required."],
  },
  phone: {
    type: "number",
    required: [true, "phone is required."],
  },
  address: {
    type: "string",
    required: [true, "Address is required."],
  },
  item: {
    type: "string",
    required: [true, "Item Code is required."],
  },
  itemname: {
    type: "string",
    required: [true, "Item Name is required."],
  },
  imageurl: {
    type: "string",
    required: false,
  },
  method: {
    type: "string",
    required: false,
    default: "COD",
  },
  fulfilled: {
    type: "boolean",
    default: false,
  },
});

module.exports = mongoose.model("orders", productSchema);
