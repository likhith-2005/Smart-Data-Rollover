const express = require("express");
const router = express.Router();

const {
  createUser,
  getHistory,
  updateUsage,
  addUsage,
  getUsers,
  rechargePlan,
  addTopup,
  deleteUser
} = require("../controllers/userController");

// ------------------------------------
// Add new user
// ------------------------------------
router.post("/add", createUser);

// ------------------------------------
// Update usage
// ------------------------------------
router.post("/usage", updateUsage);

// ------------------------------------
// Add usage (simple)
// ------------------------------------
router.post("/add-usage", addUsage);

// ------------------------------------
// Get all users
// ------------------------------------
router.get("/", getUsers);

// ------------------------------------
// Recharge user plan
// ------------------------------------
router.post("/recharge", rechargePlan);

// ------------------------------------
// Add booster top-up
// ------------------------------------
router.post("/add-topup", addTopup);

// ------------------------------------
// Get usage history
// ------------------------------------
router.get("/:userId/history", getHistory);

// ------------------------------------
// ❗ DELETE USER — THIS WAS MISSING
// ------------------------------------
router.delete("/delete/:userId", deleteUser);

module.exports = router;