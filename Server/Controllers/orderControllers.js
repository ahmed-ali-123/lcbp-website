const ordermodel = require("../Models/ordermodel");

module.exports.addOrder = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.phone ||
      !req.body.address ||
      !req.body.item ||
      !req.body.itemname ||
      !req.body.method
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const order = await ordermodel.create(req.body);
    if (order) {
      res.status(200).json({ success: true, order });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let order = await ordermodel.findById(id);
    if (order) {
      order.fulfilled = true;
      await order.save();
      res.status(200).json({ success: true, order });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
    console.log(e);
  }
};
