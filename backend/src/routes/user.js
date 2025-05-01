const { Router } = require("express");
const express = require("express");
const { User } = require("../db");
const router = express.Router();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  const isExtNameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtNameValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
  }
};

// Initialize multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// User Routes
router.post("/signup", async (req, res) => {
  // Implemented User signup logic
  try {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({
      username: username,
    });
    if (!existingUser) {
      const encodedPassword = await bycrypt.hash(password, 10);
      const user = await User.create({
        name: name,
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

// router.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const username = req.user?.username; // Extract username from token
//     if (!username) {
//       return res.status(403).json({ message: "Username not found in token" });
//     }
//     const user = await User.findOne({ username }).select("-password"); // Find user by username

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (err) {
//     if (!res.headersSent) {
//       return res.status(500).json({ error: err.message });
//     }
//   }
// });

// Update user password
router.put("/profile/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const username = req.user?.username;
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

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// Route to update user profile (PUT)
router.put("/profile", authMiddleware, upload.single("profilePicture"), async (req, res) => {
  const { username, bio, name } = req.body;
  const profilePicture = req.file ? `/uploads/profile-pictures/${req.file.filename}` : undefined;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });   
    }

    // Update fields if provided
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (name) user.name = name;  // Add the name field update
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    const updatedUser = {
      username: user.username,
      bio: user.bio,
      name: user.name,  // Include name in the response
      profilePicture: user.profilePicture,
    };

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});






module.exports = router;
