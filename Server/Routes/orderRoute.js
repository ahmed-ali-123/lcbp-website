const express = require("express");
const { addOrder, completeOrder } = require("../Controllers/orderControllers");

const router = express.Router();
router.post("/add", addOrder);
router.post("/complete/:id", completeOrder);

module.exports = router;
