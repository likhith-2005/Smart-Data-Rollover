const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) return res.status(400).json({ message: "Admin not found" });

  if (password !== admin.password)
    return res.status(400).json({ message: "Incorrect Password" });

  res.json({ message: "Login Successful" });
});

module.exports = router;
