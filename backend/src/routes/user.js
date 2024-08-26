const { Router } = require("express");
const express = require("express");
const { User } = require("../db");
const router = express.Router();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/auth");
// User Routes
router.post("/signup", async (req, res) => {
  // Implemented User signup logic
  try {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({
      username: username,
    });
    if (!existingUser) {
      const encodedPassword = await bycrypt.hash(password, 10);
      const user = await User.create({
        username: username,
        password: encodedPassword,
      });
      const userId = user._id;
      const token = jwt.sign(
        {
          username,
          userId,
        },
        JWT_SECRET
      );

      res.json({
        token,
        msg: "User created successfully",
      });
    } else {
      res.json({
        msg: "User already exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred during signup",
      error: error.message,
    });
  }
});
router.post("/signin", async (req, res) => {
  // Implemented User login logic
  try {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      const validPassword = await bycrypt.compare(
        password,
        existingUser.password
      );
      const userId = existingUser._id;
      if (!validPassword) {
        return res.json({
          msg: "your password is incorrect",
        });
      }
      const token = jwt.sign(
        {
          username,
          userId,
        },
        JWT_SECRET
      );
      return res.json({
        token,
      });
    }
    return res.json({
      msg: "User does not exist",
    });
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred during signin",
      error: error.message,
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const username = req.user?.username; // Extract username from token
    if (!username) {
      return res.status(403).json({ message: "Username not found in token" });
    }
    const user = await User.findOne({ username }).select("-password"); // Find user by username

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// Update user password
router.put("/profile/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const userId = user.id;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bycrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bycrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    const token = jwt.sign(
      {
        username,
        userId,
      },
      JWT_SECRET
    );
    return res.json({
      token,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
