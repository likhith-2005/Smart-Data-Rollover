const express = require("express");
const router = express.Router();
const { createUser, updateUsage, getUsers, rechargePlan } = require("../controllers/userController");
const { getHistory } = require("../controllers/userController");

router.get("/history/:userId", getHistory);


router.post("/create", createUser);
router.post("/usage", updateUsage);
router.get("/", getUsers);
router.post("/recharge", rechargePlan);


module.exports = router;

