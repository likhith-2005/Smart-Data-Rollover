const User = require("../models/User");


// 🔥 Plan Expiry Logic
const checkPlanExpiry = (user) => {
  const today = new Date();
  const rechargeDate = new Date(user.rechargeStartDate);

  const expiryDate = new Date(rechargeDate);
  expiryDate.setDate(expiryDate.getDate() + user.validity);

  return today > expiryDate;
};


// 🔥 Automatic Daily Reset Logic
const checkDailyReset = async (user) => {
  const today = new Date();
  const lastReset = new Date(user.lastResetDate);

  const isNewDay =
    today.getFullYear() !== lastReset.getFullYear() ||
    today.getMonth() !== lastReset.getMonth() ||
    today.getDate() !== lastReset.getDate();

  if (isNewDay) {
    const remainingData = user.dailyLimit - user.todayUsage;

    if (remainingData > 0) {
      user.dataBank += remainingData;
    }

    user.todayUsage = 0;
    user.lastResetDate = today;

    await user.save();
  }
};


// 🔹 Create new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 🔹 Update Usage
exports.updateUsage = async (req, res) => {
  try {
    const { userId, usage } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Check if plan expired
    if (checkPlanExpiry(user)) {
      user.dataBank = 0;
      await user.save();
      return res.status(403).json({ message: "Plan expired. Please recharge." });
    }

    // 🔥 Check daily reset
    await checkDailyReset(user);

    if (usage <= user.dailyLimit) {
      const remaining = user.dailyLimit - usage;
      user.dataBank += remaining;
    } else {
      const extraUsage = usage - user.dailyLimit;

      if (user.dataBank >= extraUsage) {
        user.dataBank -= extraUsage;
      } else {
        user.dataBank = 0;
      }
    }

    user.todayUsage = usage;

    await user.save();

    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 🔹 Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    for (let user of users) {

      // 🔥 If expired, clear databank
      if (checkPlanExpiry(user)) {
        user.dataBank = 0;
      }

      await checkDailyReset(user);
    }

    res.status(200).json(users);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 🔹 Recharge Plan
exports.rechargePlan = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.todayUsage = 0;
    user.dataBank = 0;
    user.rechargeStartDate = new Date();
    user.lastResetDate = new Date();

    await user.save();

    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
