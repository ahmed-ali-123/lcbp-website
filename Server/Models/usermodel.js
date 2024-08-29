const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Name is required."],
  },
  username: {
    type: "string",
    required: [true, "Username is required."],
    unique: [true, "This username is already in use."],
  },
  imageurl: {
    type: "string",
    required: false,
    default:
      "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
  },
  earnedbyreffers: {
    type: "number",
    default: 0,
  },
  planJoinDate: {
    type: "date",
    required: false,
  },
  planUpgradeDate: {
    type: "date",
    required: false,
  },
  earnedbyspinandbox: {
    type: "number",
    default: 0,
  },
  lastOpenedSpin: {
    type: "date",
  },
  todayOpened: {
    type: "number",
    default: 0,
  },
  limit: {
    type: "number",
  },
  lastOpenedBox: {
    type: "date",
  },
  prize: {
    type: "number",
  },
  teamearning: {
    type: "number",
    default: 0,
  },
  classJoined: {
    type: "string",
    default: "none",
  },
  banned: {
    type: "boolean",
    default: false,
  },
  cooltime: {
    type: "number",
  },
  alltimeearned: {
    type: "number",
    default: 0,
  },
  withdrawn: {
    type: "number",
    default: 0,
  },
  email: {
    type: "string",
    unique: [true, "This email is already in use."],
    required: [true, "Email is required."],
  },
  phone: {
    type: "number",
    required: [true, "Phone number is required."],
    unique: [true, "This phone number is already in use."],
  },
  password: {
    type: "string",
    required: [true, "Phone number is required."],
  },
  balance: {
    type: "number",
    required: false,
    default: 0,
  },
  reffer: {
    type: "string",
    default: null,
  },
  chaintwo: {
    type: "string",
    default: null,
  },
  chainthree: {
    type: "string",
    default: null,
  },

  chainfour: {
    type: "string",
    default: null,
  },

  chainfive: {
    type: "string",
    default: null,
  },
  plan: {
    type: "string",
    default: null,
  },
  blocked: {
    type: "boolean",
    default: false,
  },
  planpending: {
    type: "boolean",
    default: false,
  },
  withdrawpending: {
    type: "boolean",
    default: false,
  },
  planDate: {
    type: "date",
    default: null,
  },
  withdrawmessage: {
    type: "string",
    default: null,
  },
});

module.exports = mongoose.model("users", userSchema);
