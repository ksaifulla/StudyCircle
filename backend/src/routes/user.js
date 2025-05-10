const express = require("express");
const { User } = require("../db");
const router = express.Router();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

// Multer with memory storage for Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    const isExtNameValid = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (isMimeTypeValid && isExtNameValid) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile-pictures" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Route: Upload profile picture only 
router.post(
  "/upload-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: result.secure_url },
        { new: true },
      );

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: result.secure_url,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({
        error: "Cloudinary upload failed",
        details: error.message,
      });
    }
  },
);

// Route: Update user profile 
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    const { username, bio, name } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Upload profile picture to Cloudinary if provided
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        user.profilePicture = result.secure_url;
      }

      // Update other fields if provided
      if (username) user.username = username;
      if (bio) user.bio = bio;
      if (name) user.name = name;

      await user.save();

      const updatedUser = {
        username: user.username,
        bio: user.bio,
        name: user.name,
        profilePicture: user.profilePicture,
      };

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Error updating profile:", err.message);
      res.status(500).json({ message: "Server error." });
    }
  },
);

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
        JWT_SECRET,
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
        existingUser.password,
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
        JWT_SECRET,
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
      JWT_SECRET,
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

    // Append /uploads/ if profilePicture exists
    const isFullUrl = (str) => /^https?:\/\//i.test(str);

    const profilePicturePath = user.profilePicture
      ? isFullUrl(user.profilePicture)
        ? user.profilePicture // keep full URL 
        : `/uploads/${user.profilePicture}` // local file
      : null;

    res.json({ ...user.toObject(), profilePicture: profilePicturePath });
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
