const { Router } = require("express");
const express = require("express");
const { User } = require("../db");
const router = express.Router();
const bycrypt = require("bcrypt");
// User Routes
router.post("/signup", async (req, res) => {
  // Implemented User signup logic
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await User.findOne({
    username: username,
  });
  if (!existingUser) {
    const encodedPassword = await bycrypt.hash(password, 10);
    await User.create({
      username: username,
      password: encodedPassword,
    });
    res.json({
      msg: "User created successfully",
    });
  } else {
    res.json({
      msg: "User already exist",
    });
  }
});

module.exports = router;
