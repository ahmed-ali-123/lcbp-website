const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
  heading1: {
    type: "string",
    required: false,
    default: "",
  },
  text1: {
    type: "string",
    required: false,
    default: "",
  },
  heading2: {
    type: "string",
    required: false,
    default: "",
  },
  text2: {
    type: "string",
    required: false,
    default: "",
  },
  heading3: {
    type: "string",
    required: false,
    default: "",
  },
  text3: {
    type: "string",
    required: false,
    default: "",
  },
  heading4: {
    type: "string",
    required: false,
    default: "",
  },
  text4: {
    type: "string",
    required: false,
    default: "",
  },
  heading5: {
    type: "string",
    required: false,
    default: "",
  },
  text5: {
    type: "string",
    required: false,
    default: "",
  },
  planupgradeamount: {
    type: "number",
    required: false,
    default: 0,
  },
  planboughtamount: {
    type: "number",
    required: false,
    default: 0,
  },
  newUsers: {
    type: "number",
    required: false,
    default: 0,
  },
  newMessage: {
    type: "string",
    required: false,
    default: "",
  },
  newHeading: {
    type: "string",
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("values", valueSchema);
