const express = require("express");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  getproduct,
} = require("../Controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.get("/get", getAllProducts);
router.delete("/delete/:id", deleteProduct);
router.get("/product/:id", getproduct);

module.exports = router;
