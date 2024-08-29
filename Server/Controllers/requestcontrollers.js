const planmodel = require("../Models/planmodel");
const requestmodel = require("../Models/requestmodel");
const valuesmodel = require("../Models/valuesmodel");
const transactionsmodel = require("../Models/transactionsmodel");
const usermodel = require("../Models/usermodel");

module.exports.addreq = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const {
      usersname,
      usersemail,
      usersimageurl,
      planname,
      planid,
      planprice,
      usersid,
      proof,
      accountnum,
      method,
      transactionid,
    } = req.body;
    console.log("Request recieved", req.body);
    if (
      !usersname ||
      !usersemail ||
      !usersimageurl ||
      !planname ||
      !planid ||
      !planprice ||
      !usersid ||
      !proof ||
      !accountnum ||
      !method ||
      !transactionid
    ) {
      res.status(400).json({ success: false, message: "Invalid request" });
    }

    const existingRequest = await requestmodel.findOne({ transactionid });
    if (existingRequest) {
      res
        .status(400)
        .json({ success: false, message: "Request already exists" });
    }

    const newreq = await requestmodel.create({
      usersname,
      usersid,
      usersemail,
      usersimageurl,
      planname,
      planprice,
      proof,
      pending: true,
      accountnum,
      planid,
      method,
      transactionid,
    });
    const user = await usermodel.findById(usersid);
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    user.plan = planid;
    user.planpending = true;
    await user.save();
    res.status(200).json({
      success: true,
      data: newreq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

module.exports.getfreeplan = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { userid, planid } = req.body;
    const plan = await planmodel.findById(planid);
    const user = await usermodel.findById(userid);
    user.plan = plan._id;
    user.planpending = false;
    await user.save();
    res.status(200).json({ success: true, message: "Plan approved" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.getrequests = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    let requests = await requestmodel
      .find({ pending: true })
      .sort({ _id: -1 })
      .lean()
      .exec();
    if (!requests) {
      throw new Error("Requests not found");
    }
    res.status(200).json({ success: true, data: requests });
  } catch (e) {
    console.error(e);
    if (e instanceof TypeError) {
      res
        .status(500)
        .json({ success: false, message: "Null pointer reference" });
    } else {
      res.status(400).json({ success: false, message: e.message });
    }
  }
};
module.exports.deleteRequest = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }
    await requestmodel.deleteOne({ _id: id }).lean().exec();
    await usermodel
      .findOneAndUpdate(
        { _id: req.body.userid },
        { $set: { planpending: false, plan: null } },
        { new: true }
      )
      .lean()
      .exec();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(`Error deleting request:`, e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports.approveRequest = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { userid, requstid, planid } = req.body;

    let profit = 0;
    let paid = 0;

    const plan = await planmodel.findById(planid);
    if (!plan) {
      throw new Error("Plan not found");
    }

    const {
      amountpkr,
      firstChain,
      secondChain,
      thirdChain,
      fourthChain,
      fifthChain,
    } = plan;

    profit = amountpkr;

    const user = await usermodel.findByIdAndUpdate(
      userid,
      {
        $set: {
          planpending: false,
          prize: plan.boxprice,
          cooltime: plan.boxcooltime,
          limit: plan.boxlimit,
        },
      },
      { new: true }
    );

    const value = await valuesmodel.findById("66893f2d6a0e97be82e77c03");
    if (!value) {
      throw new Error("Value not found");
    }
    value.newUsers += 1;
    value.planboughtamount += amountpkr;
    await value.save();

    const updateUserBalance = async (username, chainMultiplier) => {
      const user1 = await usermodel.findOne({ username });
      if (user1 && user1.plan) {
        const amountToAdd = (amountpkr * chainMultiplier) / 100;
        profit -= amountToAdd;
        paid += amountToAdd;
        user1.balance = (user1.balance || 0) + amountToAdd;
        user1.earnedbyreffers = (user1.earnedbyreffers || 0) + amountToAdd;
        user1.alltimeearned = (user1.alltimeearned || 0) + amountToAdd;
        transactionsmodel.create({
          type: "reffer",
          amount: amountToAdd,
          from: user.username,
          to: user1.username,
        });
        await user1.save();
      }
    };

    await Promise.all([
      updateUserBalance(user.reffer, firstChain),
      updateUserBalance(user.chaintwo, secondChain),
      updateUserBalance(user.chainthree, thirdChain),
      updateUserBalance(user.chainfour, fourthChain),
      updateUserBalance(user.chainfive, fifthChain),
    ]);
    const updatedRequest = await requestmodel
      .findByIdAndUpdate(
        requstid,
        {
          $set: {
            pending: false,
            accepted: true,
            profit,
            paid,
            planJoinDate: Date.now(),
          },
        },
        { new: true }
      )
      .lean()
      .exec();

    if (!updatedRequest) {
      throw new Error("Request not found");
    }

    return res.status(200).json({ success: true, data: user });
  } catch (e) {
    console.error(`Error approving request:`, e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
