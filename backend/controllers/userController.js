const UsageHistory = require("../models/UsageHistory");
const User = require("../models/User");

// ----------------------------------------------------
// ✔ Check Plan Expiry
// ----------------------------------------------------
const checkPlanExpiry = (user) => {
  if (!user.rechargeStartDate || user.validity === 0) return false;

  const today = new Date();
  const rechargeDate = new Date(user.rechargeStartDate);

  const expiryDate = new Date(rechargeDate);
  expiryDate.setDate(expiryDate.getDate() + user.validity);

  return today > expiryDate;
};

// ----------------------------------------------------
// ✔ Daily Reset Logic
// ----------------------------------------------------
const checkDailyReset = async (user) => {
  const today = new Date();
  const lastReset = new Date(user.lastResetDate);

  const isNewDay = today.toDateString() !== lastReset.toDateString();

  if (isNewDay && user.dailyLimit > 0) {
    const used = user.todayUsage;
    const remaining = user.dailyLimit - used;

    user.history.push({
      date: new Date(),
      usage: used,
      message: `Daily Summary → Limit: ${user.dailyLimit}MB | Used: ${used}MB | Remaining: ${remaining}MB`,
    });

    if (remaining > 0) user.dataBank += remaining;

    user.todayUsage = 0;
    user.lastResetDate = today;

    await user.save();
  }
};

// ----------------------------------------------------
// ✔ CREATE USER
// ----------------------------------------------------
const createUser = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and Phone Number are required",
      });
    }

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const newUser = new User({
      name,
      phoneNumber,
      dataLeft: 0,
      validity: 0,
      rechargeStartDate: null,
      todayUsage: 0,
      dailyLimit: 0,
      dataBank: 0,
      lastResetDate: new Date(),
      history: [],
    });

    await newUser.save();

    return res.json({
      success: true,
      message: "User added successfully ✔️",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// ✔ Get History
// ----------------------------------------------------
const getHistory = async (req, res) => {
  try {
    const history = await UsageHistory.find({
      userId: req.params.userId,
    }).sort({ date: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ----------------------------------------------------
// ✔ UPDATE USAGE
// ----------------------------------------------------
const updateUsage = async (req, res) => {
  try {
    const { userId, usage } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.dailyLimit === 0)
      return res.status(400).json({ message: "No active plan. Please recharge." });

    if (checkPlanExpiry(user))
      return res.status(400).json({ message: "Plan expired. Recharge required." });

    await checkDailyReset(user);

    let message = "";
    let remaining = user.dailyLimit - usage;

    if (usage <= user.dailyLimit) {
      user.dataBank += remaining;
      message = `Used ${usage}MB. Remaining ${remaining}MB added to DataBank.`;
    } else {
      let extra = usage - user.dailyLimit;

      if (user.dataBank >= extra) {
        user.dataBank -= extra;
        message = `Used ${usage}MB. Extra ${extra}MB taken from DataBank.`;
      } else {
        message = `Used ${usage}MB. Overused. DataBank is now 0.`;
        user.dataBank = 0;
      }
    }

    user.todayUsage = usage;

    user.history.push({
      usage,
      date: new Date(),
      message,
    });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ----------------------------------------------------
// ✔ ADD USAGE (Simple)
// ----------------------------------------------------
const addUsage = async (req, res) => {
  try {
    const { userId, usage } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.dailyLimit === 0)
      return res.status(400).json({ message: "No active plan. Please recharge." });

    if (checkPlanExpiry(user))
      return res.status(400).json({ message: "Plan expired. Recharge required." });

    await checkDailyReset(user);

    const remaining = user.dailyLimit - user.todayUsage;

    let usedToday = 0;
    let usedFromBank = 0;

    if (usage <= remaining) {
      usedToday = usage;
      user.todayUsage += usage;
    } else {
      usedToday = remaining;
      usedFromBank = usage - remaining;

      user.todayUsage = user.dailyLimit;

      user.dataBank -= usedFromBank;
      if (user.dataBank < 0) user.dataBank = 0;
    }

    user.history.push({
      usage,
      date: new Date(),
      message: `Used ${usedToday}MB today, ${usedFromBank}MB from DataBank`,
    });

    await user.save();

    res.json({ message: "Usage updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding usage", error });
  }
};

// ----------------------------------------------------
// ✔ Get All Users
// ----------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    for (let user of users) {
      await checkDailyReset(user);
      if (checkPlanExpiry(user)) user.dataBank = 0;
      await user.save();
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ----------------------------------------------------
// ✔ Recharge Plan
// ----------------------------------------------------
const rechargePlan = async (req, res) => {
  try {
    const { userId, dailyLimit, validity } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (dailyLimit === null || validity === null) {
      return res.json({ message: "Default selected — No recharge done" });
    }

    user.dailyLimit = dailyLimit;
    user.validity = validity;
    user.todayUsage = 0;
    user.dataBank = 0;
    user.rechargeStartDate = new Date();
    user.lastResetDate = new Date();

    user.history.push({
      date: new Date(),
      usage: 0,
      message: `Recharged: ${dailyLimit / 1000}GB/day for ${validity} days`,
    });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ----------------------------------------------------
// ✔ Add Top-Up
// ----------------------------------------------------
const addTopup = async (req, res) => {
  try {
    const { userId, extraData } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.dataBank += extraData;

    user.history.push({
      date: new Date(),
      usage: 0,
      message: `Top-Up Added: ${extraData / 1000}GB`,
    });

    await user.save();

    res.json({ message: "Top-Up added", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding top-up", error });
  }
};

// ----------------------------------------------------
// ❗ ADD THIS — Delete User (Fixes your error)
// ----------------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// EXPORT ALL FUNCTIONS
// ----------------------------------------------------
module.exports = {
  createUser,
  getHistory,
  updateUsage,
  addUsage,
  getUsers,
  rechargePlan,
  addTopup,
  deleteUser   // ✔ Must be included
};