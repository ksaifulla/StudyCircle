const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../db").File;
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|docx|pptx|ppt/;
  const mimeTypes =
    /image\/jpeg|image\/jpg|image\/png|application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation/;

  const isValidExtension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isValidMime = mimeTypes.test(file.mimetype);

  if (isValidExtension && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and document files are allowed!"));
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // Keep in memory before uploading to Cloudinary
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
}).single("file");

// Upload route
router.post("/:groupId/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ error: `Upload error: ${err.message}` });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
      // Upload to Cloudinary using a stream
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "group-files" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      const fileData = new File({
        filename: req.file.originalname,
        path: result.secure_url,
        public_id: result.public_id,
        groupId: req.params.groupId,
        title,
        size: req.file.size,
        timestamp: Date.now(),
      });

      await fileData.save();
      res.status(200).json({
        message: "File uploaded to Cloudinary and metadata saved",
        file: result.secure_url,
      });
    } catch (error) {
      console.error("Upload/DB Error:", error);
      res
        .status(500)
        .json({ error: "Upload or DB error", details: error.message });
    }
  });
});

// View route
router.get("/:groupId/view", async (req, res) => {
  try {
    const files = await File.find({ groupId: req.params.groupId });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving files" });
  }
});

// Delete route
router.delete("/:fileId", async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.fileId);

    if (!file) return res.status(404).json({ error: "File not found" });

    // Delete from Cloudinary if it has public_id
    if (file.public_id) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: "auto",
      });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ error: "Error deleting file", details: error.message });
  }
});

// Search route
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const results = await File.find({
      $or: [
        { filename: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
