const ordermodel = require("../Models/ordermodel");
const productmodel = require("../Models/productmodel");

module.exports.addProduct = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    if (
      !req.body ||
      !req.body.title ||
      !req.body.price ||
      !req.body.desc ||
      !req.body.imageurl
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const product = await productmodel.create(req.body);
    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await productmodel.find();
    const orders = await ordermodel.find({
      fulfilled: false,
    });
    res.status(200).json({ success: true, products, orders });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.deleteProduct = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { id } = req.params;
    const product = await productmodel.findByIdAndDelete(id);
    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.getproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productmodel.findById(id);
    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  } catch (e) {
    // console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};
