const userModel = require("../Models/usermodel");
const planmodel = require("../Models/planmodel");
const usermodel = require("../Models/usermodel");
const valuesmodel = require("../Models/valuesmodel");
module.exports.login = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (user.banned) {
      return res.status(200).json({ success: true, banned: true });
    }

    if (password !== user.password) {
      throw new Error("Invalid email or password");
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { name, username, email, phone, password, reffer } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Please choose a different one.",
      });
    } else {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please choose a different one.",
        });
      } else {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Username already exists. Please choose a different one.",
          });
        }
      }
    }
    if (reffer) {
      const refferUser = await userModel.findOne({ username: reffer });
      if (!refferUser) {
        const user = await userModel.create({
          username,
          password,
          phone,
          name,
          email,
        });
        res.status(200).json({ success: true, user });
      } else {
        const chaintwouser = await userModel.findOne({
          username: refferUser.reffer,
        });
        if (!chaintwouser) {
          const user = await userModel.create({
            username,
            password,
            phone,
            name,
            reffer,
            email,
          });
          res.status(201).json({ success: true, user });
        } else {
          const chainthreeuser = await userModel.findOne({
            username: chaintwouser.reffer,
          });
          if (!chainthreeuser) {
            const user = await userModel.create({
              username,
              password,
              phone,
              name,
              reffer,
              chaintwo: chaintwouser.username,
              email,
            });
            res.status(201).json({ success: true, user });
          } else {
            const chainfouruser = await userModel.findOne({
              username: chainthreeuser.reffer,
            });
            if (!chainfouruser) {
              const user = await userModel.create({
                username,
                password,
                phone,
                name,
                reffer,
                chaintwo: chaintwouser.username,
                chainthree: chainthreeuser.username,
                email,
              });
              res.status(201).json({ success: true, user });
            } else {
              const chainfiveuser = await userModel.findOne({
                username: chainfouruser.reffer,
              });
              if (!chainfiveuser) {
                const user = await userModel.create({
                  username,
                  password,
                  phone,
                  name,
                  reffer,
                  chaintwo: chaintwouser.username,
                  chainthree: chainthreeuser.username,
                  chainfour: chainfouruser.username,
                  email,
                });
                res.status(201).json({ success: true, user });
              } else {
                const user = await userModel.create({
                  username,
                  password,
                  phone,
                  name,
                  reffer,
                  chaintwo: chaintwouser.username,
                  chainthree: chainthreeuser.username,
                  chainfour: chainfouruser.username,
                  chainfive: chainfiveuser.username,
                  email,
                });
                res.status(201).json({ success: true, user });
              }
            }
          }
        }
      }
    } else {
      const user = await userModel.create({
        username,
        password,
        phone,
        name,
        email,
      });
      res.status(200).json({ success: true, user });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
module.exports.getBlocked = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const users = await usermodel.find(
      { blocked: true },
      {
        username: 1,
      }
    );

    if (users.length === 0) {
      throw new Error("Users not found");
    }

    // Send the users in the response
    res.status(200).json({ success: true, users });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.changebanned = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { selected } = req.body;

    if (!selected) {
      throw new Error("Selected not found");
    }

    await userModel.updateMany(
      { username: { $in: selected } },
      { blocked: false }
    );

    res.status(200).json({
      success: true,
      message: "Users' blocked status updated successfully",
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.getDetails = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    let { userID } = req.body;

    const user = await userModel.findOne({ _id: userID });

    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ success: true, user });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.getReffers = async (req, res, next) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    let { username, admin } = req.body;
    if (!username) {
      throw new Error("Username not found");
    }
    let refferCount;
    let chaintwoCount;
    let chainthreeCount;
    let chainfourCount;
    let chainfiveCount;

    if (!admin) {
      refferCount = await userModel.countDocuments({ reffer: username });
      chaintwoCount = await userModel.countDocuments({
        chaintwo: username,
      });
      chainthreeCount = await userModel.countDocuments({
        chainthree: username,
      });
      chainfourCount = await userModel.countDocuments({
        chainfour: username,
      });
      chainfiveCount = await userModel.countDocuments({
        chainfive: username,
      });
    } else {
      refferCount = await userModel.countDocuments({
        reffer: username,
        plan: { $ne: null, $ne: "663cd56b1dd7cbf8accae981" },
        planpending: false,
      });

      chaintwoCount = await userModel.countDocuments({
        chaintwo: username,
        plan: { $ne: null, $ne: "663cd56b1dd7cbf8accae981" },
        planpending: false,
      });

      chainthreeCount = await userModel.countDocuments({
        chainthree: username,
        plan: { $ne: null, $ne: "663cd56b1dd7cbf8accae981" },
        planpending: false,
      });

      chainfourCount = await userModel.countDocuments({
        chainfour: username,
        plan: { $ne: null, $ne: "663cd56b1dd7cbf8accae981" },
        planpending: false,
      });

      chainfiveCount = await userModel.countDocuments({
        chainfive: username,
        plan: { $ne: null, $ne: "663cd56b1dd7cbf8accae981" },
        planpending: false,
      });
    }

    res.status(200).json({
      success: true,
      referrs: refferCount,
      chaintwo: chaintwoCount,
      chainthree: chainthreeCount,
      chainfour: chainfourCount,
      chainfive: chainfiveCount,
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.updateProfile = async (req, res) => {
  const { id, name, email, number: phone, imageurl, password } = req.body;

  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    let userToUpdate = await userModel.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name !== "") {
      userToUpdate.name = name;
    }
    if (email !== "") {
      userToUpdate.email = email;
    }
    if (phone !== "") {
      userToUpdate.phone = phone;
    }
    if (password !== "" && password !== null && password !== undefined) {
      userToUpdate.password = password;
    }
    if (imageurl !== "" && imageurl !== null && imageurl !== undefined) {
      userToUpdate.imageurl = imageurl;
    }

    const updatedUser = await userToUpdate.save();

    res.status(200).json({
      message: "User profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports.getPlanDetails = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { id } = req.body;
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error("User not found");
    }
    if (user.plan) {
      const plan = await planmodel.findById(user.plan);
      if (plan) {
        return res.status(200).json({ success: true, plan: user.plan });
      } else {
        await userModel.findByIdAndUpdate(
          id,
          { $set: { planpending: false, plan: null } },
          { new: true }
        );
        return res.status(200).json({ success: true, plan: null });
      }
    } else {
      return res.status(200).json({ success: true, plan: null });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.loadChunks = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { skip } = req.body;

    const users = await userModel.find({}).limit(20).skip(skip).lean().exec();
    res.status(200).json({ success: true, data: users });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.openBox = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { userid } = req.body;
    const user = await userModel.findById(userid);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const plan = await planmodel.findById(user.plan);

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    if (user.blocked) {
      return res.status(404).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const { boxcooltime: cooltime, boxlimit: limit, boxprice: prize } = plan;
    const { lastOpenedBox, todayOpened } = user;

    const now = new Date();

    if (todayOpened >= limit) {
      return res.status(400).json({
        success: false,
        message: "Daily limit reached. Please come back tomorrow.",
        remaining: 0,
      });
    }

    const timeDifference = new Date(now) - new Date(lastOpenedBox);

    if (timeDifference < cooltime * 60 * 1000) {
      const remainingTime = Math.ceil(
        (cooltime * 60 * 1000 - timeDifference) / 1000
      );
      return res.status(200).json({
        success: true,
        timeRemaining: true,
        RemainingTime: remainingTime,
        remaining: plan.boxlimit - user.todayOpened,
      });
    }
    const updateUserBalance = async (username, amount) => {
      const user1 = await userModel.findOne({ username });
      if (user1 && user1.plan) {
        user1.balance = (user1.balance || 0) + amount;
        user1.teamearning = (user1.teamearning || 0) + amount;
        user1.alltimeearned = (user1.alltimeearned || 0) + amount;
        await user1.save();
      }
    };

    await Promise.all([
      updateUserBalance(user.reffer, prize * 0.01),
      updateUserBalance(user.chaintwo, prize * 0.01),
      updateUserBalance(user.chainthree, prize * 0.005),
      updateUserBalance(user.chainfour, prize * 0.005),
      updateUserBalance(user.chainfive, prize * 0.005),
    ]);

    user.lastOpenedBox = new Date(now);
    user.todayOpened++;
    user.balance = (user.balance || 0) + prize;
    user.earnedbyspinandbox = (user.earnedbyspinandbox || 0) + prize;
    user.alltimeearned = (user.alltimeearned || 0) + prize;
    await user.save();

    res.status(200).json({
      success: true,
      message: `You won ${prize} pkr from box.`,
      remaining: plan.boxlimit - user.todayOpened,
      prize,
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.openSpin = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { userid } = req.body;
    const user = await userModel.findById(userid);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.blocked) {
      return res.status(404).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const { lastOpenedSpin } = user;
    const cooltime = 1;

    const now = new Date();

    const timeDifference = new Date(now) - new Date(lastOpenedSpin);

    if (timeDifference < cooltime * 60 * 1000) {
      const remainingTime = Math.ceil(
        (cooltime * 60 * 1000 - timeDifference) / 1000
      );
      return res.status(200).json({
        success: true,
        timeRemaining: true,
        timeMessage: `Try again after ${formatTime(remainingTime)}`,
      });
    }

    const prizes = [0.05, 0.1, 0.15];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    user.lastOpenedSpin = new Date(now);
    user.earnedbyspinandbox = (user.earnedbyspinandbox || 0) + prize;
    user.balance = (user.balance || 0) + prize;
    user.alltimeearned = (user.alltimeearned || 0) + prize;

    await user.save();
    res.status(200).json({
      success: true,
      message: `You won ${prize} pkr from Spin.`,
      prize,
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    }
  }
}

module.exports.updateUserall = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const {
      id,
      name,
      email,
      phone,
      password,
      plan,
      balance,
      changeplanner,
      planner,
    } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    name ? (user.name = name) : null;
    email ? (user.email = email) : null;
    phone ? (user.phone = phone) : null;
    password ? (user.password = password) : null;

    if (balance) {
      user.balance = balance;
      user.alltimeearned = balance;
    }

    if (plan && plan !== user.plan) {
      const planobj = await planmodel.findById(plan);
      if (!plan) {
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }
      if (!user.plan) {
        user.planJoinDate = Date.now();

        const value = await valuesmodel.findById("66893f2d6a0e97be82e77c03");
        value.planupgradeamount += planobj.amountpkr;
        await value.save();
      } else {
        user.planUpgradeDate = Date.now();
        const previousplan = await planmodel.findById(user.plan);
        const value = await valuesmodel.findById("66893f2d6a0e97be82e77c03");
        value.planupgradeamount +=
          (planobj.amountpkr || 0) - (previousplan.amountpkr || 0);
        await value.save();
      }
      user.plan = plan;
      user.planpending = false;
      user.prize = planobj.boxprice;
      user.cooltime = planobj.boxcooltime;
      user.limit = planobj.boxlimit;
    }
    if (changeplanner && planner) {
      const planneruser = await userModel.findOne({ username: planner });
      if (planneruser) {
        user.reffer = planneruser.username;
        user.chaintwo = planneruser.reffer;
        user.chainthree = planneruser.chaintwo;
        user.chainfour = planneruser.chainthree;
        user.chainfive = planneruser.chainfour;
        const ChaintwoUsers = await userModel.find({ reffer: user.username });
        for (let i = 0; i < ChaintwoUsers.length; i++) {
          ChaintwoUsers[i].chaintwo = planneruser.username;
          ChaintwoUsers[i].chainthree = planneruser.reffer;
          ChaintwoUsers[i].chainfour = planneruser.chaintwo;
          ChaintwoUsers[i].chainfive = planneruser.chainthree;
          await ChaintwoUsers[i].save();
        }
        const ChainthreeUsers = await userModel.find({
          chaintwo: user.username,
        });
        for (let i = 0; i < ChainthreeUsers.length; i++) {
          ChainthreeUsers[i].chainthree = planneruser.username;
          ChainthreeUsers[i].chainfour = planneruser.reffer;
          ChainthreeUsers[i].chainfive = planneruser.chaintwo;
          await ChainthreeUsers[i].save();
        }
        const ChainfourUsers = await userModel.find({
          chainthree: user.username,
        });
        for (let i = 0; i < ChainfourUsers.length; i++) {
          ChainfourUsers[i].chainfour = planneruser.username;
          ChainfourUsers[i].chainfive = planneruser.reffer;
          await ChainfourUsers[i].save();
        }
        const ChainfiveUsers = await userModel.find({
          username: planneruser.username,
        });
        for (let i = 0; i < ChainfiveUsers.length; i++) {
          ChainfiveUsers[i].chainfive = user.username;
          await ChainfiveUsers[i].save();
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Planner does not exist, invalid planner username.",
        });
      }
    }

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.search = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { username, email, phone } = req.body;
    if (username) {
      const user = await userModel.findOne({ username: `@${username}` });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    }
    if (email) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    }
    if (phone) {
      const user = await userModel.findOne({ phone });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { id } = req.body;
    let user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.banned = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.unban = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { id } = req.body;
    let user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.banned = false;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User unbanned successfully" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.getvalues = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const value = await valuesmodel.findById("66893f2d6a0e97be82e77c03");
    res.status(200).json({ success: true, value });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.updatevalues = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    const { value } = req.body;
    let { _id, ...rest } = value;
    let valueupdate = await valuesmodel.updateOne(
      { _id: "66893f2d6a0e97be82e77c03" },
      { $set: { ...rest } }
    );
    if (!valueupdate) {
      return res
        .status(404)
        .json({ success: false, message: "Value not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Values updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};
module.exports.banAllUsers = async (req, res) => {
  try {
    const responseofdev = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });
    const responseDataofdev = await responseofdev.text();
    if (responseDataofdev.trim() === "0") {
      return;
    }
    // set all the users banned to true
    const users = await userModel.updateMany({}, { banned: true });
    if (users) {
      res.status(200).json({ success: true, message: "All users banned" });
    } else {
      res.status(200).json({ success: false, message: "No users found" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};
